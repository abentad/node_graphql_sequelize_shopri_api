const { createWriteStream, unlink } = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/getUserId');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const handleUserUpdate = require('../utils/handleUserUpdate');
const handleProductUpdate = require('../utils/handleProductUpdate');


const jwtSecret = 'somesecret';

const Mutation = {
    async createUser(parent, { data }, { db }, info){
        if(data.password.length < 8) throw new Error('Password length must be at least 8');
        data.password = await hashPassword(data.password);
        const user = await db.users.create(data);
        if(!user) throw new Error('Failed Signing up user');
        const token = jwt.sign({ id: user.id }, jwtSecret);
        return { user, token };    
    },
    async loginUser(parent, { data }, { db }, info){
        const [user] = await db.users.findAll({ where: { email: data.email } });
        if(!user) throw new Error('Email doesn\'t exist');
        const isMatch = await comparePassword(data.password, user.password);
        if(!isMatch) throw new Error('Incorrect password');
        const token = jwt.sign({ id: user.id }, jwtSecret);
        return { user, token };
    },
    async loginUserByToken(parent, args, { db, req }, info){
        const userId = getUserId(req);
        const [user] = await db.users.findAll({ where: { id: userId }});
        if(!user) throw new Error('User not found');
        return user;
    },
    async updateUser(parent, { data }, { db, req }, info){
        //TODO: fix update
        const userId = getUserId(req);
        const [originalUser] = await db(`SELECT * FROM users WHERE id = ${userId}`);
        if(!originalUser) throw new Error('User not found');
        if(data.password) data.password = await hashPassword(data.password);
        const d = handleUserUpdate(data, originalUser);
        const updateData = await db(`UPDATE users SET deviceToken = '${d.deviceToken}', username = '${d.username}', email = '${d.email}',\
        phoneNumber = '${d.phoneNumber}', password = '${d.password}', profile_image = '${d.profile_image}', dateJoined = '${d.dateJoined}' WHERE id = ?`,[userId]);
        if(updateData['changedRows'] === 0) throw new Error('Failed updating User');
        const [updatedUser] = await db(`SELECT * FROM users WHERE id = ${userId}`);
        return updatedUser;
    },
    async deleteUser(parent, args, { db, req }, info){
        const userId = getUserId(req);
        const [user] = await db.users.findAll({ where: { id: userId }});
        if(!user) throw new Error('User not found');
        await db.users.destroy({ where: { id: userId }});
        return user;
    },
    //For admin use only need to add authorization
    async deleteUserById(parent, args, { db, req }, info){
        const [user] = await db.users.findAll({ where: { id: args.id }});
        if(!user) throw new Error('User not found');
        await db.users.destroy({ where: { id: args.id }});
        return user;
    },
    async createProduct(parent, { data }, { db, req }, info){
        const userId = getUserId(req);
        const product = await db.products.create({ ...data, posterId: userId});
        if(!product) throw new Error('Failed posting product');
        return product;
    },
    async updateProduct(parent, { data }, { db, req }, info){
        //TODO: Fix this
        const userId = getUserId(req);
        const [originalProduct] = await db(`SELECT * FROM products WHERE id = ${data.id}`);
        if(!originalProduct) throw new Error('Product not found');
        if(originalProduct.posterId !== userId) throw new Error('User not authorized to update product');
        const d = handleProductUpdate(data, originalProduct);
        const updateData = await db(`UPDATE products SET isPending = '${d.isPending}', views = '${d.views}', name = '${d.name}',\
        price = '${d.price}', description = '${d.description}', category = '${d.category}', image = '${d.image}', datePosted = '${d.datePosted}' WHERE id = ?`,[data.id]);
        if(updateData['changedRows'] === 0) throw new Error('Failed updating Product');
        const [updatedProduct] = await db(`SELECT * FROM products WHERE id = ${data.id}`);
        return updatedProduct;
    },
    async deleteProduct(parent, args, { db, req}, info){
        const userId = getUserId(req);
        const [product] = await db.products.findAll({ where: { id: args.id }});
        if(!product) throw new Error('Product not found');
        if(product.posterId !== userId) throw new Error('User not authorized to delete post');
        await db.products.destroy({ where: { id: args.id }});
        return product;
    },
    singleUpload: async (parent, { file }) => {
        const { createReadStream, filename, mimetype, encoding } = await file;  
        const stream = createReadStream();
        const filelocation = path.join(__dirname, `/../images/${filename}`);
        await new Promise((resolve, reject) => {
            const writeStream = createWriteStream(filelocation);
            writeStream.on('finish', resolve);
            writeStream.on('error', (error) => {
              unlink(filelocation, () => {
                reject(error);
              });
            });
            stream.on('error', (error) => writeStream.destroy(error));
            stream.pipe(writeStream);
        });  
        return { filename, mimetype, encoding, filelocation };
    },
};

module.exports = Mutation;

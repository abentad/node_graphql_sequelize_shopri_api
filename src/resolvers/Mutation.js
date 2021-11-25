const { createWriteStream, unlink } = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const getUserId = require('../utils/getUserId');
const { hashPassword, comparePassword } = require('../utils/hashPassword');


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
        const userId = getUserId(req);
        if(data.password) data.password = await hashPassword(data.password);
        await db.users.update(data, { where: { id: userId }});
        const [user] = await db.users.findAll({ where: { id: userId }});
        return user;
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
        const userId = getUserId(req);
        const [originalProduct] = await db.products.findAll({ where: { id: data.id }});
        if(!originalProduct) throw new Error('Product not found');
        if(originalProduct.posterId !== userId) throw new Error('User not authorized to update product');
        let {id, ...newData} = data;
        await db.products.update(newData, { where: { id: data.id }});
        const [updatedProduct] = await db.products.findAll({ where: { id: data.id }});
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

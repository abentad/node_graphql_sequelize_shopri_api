
const Query = {
    async user(parent, { id }, { db }, info){
        const [user] = await db.users.findAll({ where: { id } });
        if(!user) throw new Error('User not found');
        return user;
    },
    async users(parent, args, { db }, info){
        const users = await db.users.findAll();
        return users;
    },
    async product(parent, { id }, { db }, info){
        const [product] = await db.products.findAll({ where: { id }});
        if(!product) throw new Error('Product not found');
        return product;
    },
    async products(parent, { page, limit}, { db }, info){
        if(page <= 0 || limit > 15) throw new Error('Invalid request');
        const { count, rows } = await db.products.findAndCountAll({ offset: (page - 1) * limit, limit: limit, order: [ ['id', 'DESC'] ] });
        const pages = Math.ceil(count / limit);
        return { count, products: rows, pages};
    },
}

module.exports = Query;
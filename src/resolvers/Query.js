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
    async products(parent, { page, take}, { db }, info){
        //TODO: Paginate
        const products = await db.products.findAll();
        return products;
    },
}

module.exports = Query;
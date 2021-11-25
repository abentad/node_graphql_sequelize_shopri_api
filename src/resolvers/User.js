const User = {
    async products(parent, args, { db }, info){
        const products = await db.products.findAll({ where: { posterId: parent.id }});
        return products;
    }
};

module.exports = User;
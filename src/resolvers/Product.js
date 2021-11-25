
const Product = {
    async poster(parent, args, { db }, info){
        const [user] = await db.users.findAll({ where: { id: parent.posterId}});
        return user;
    }
};

module.exports = Product;
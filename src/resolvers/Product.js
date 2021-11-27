
const Product = {
    async poster(parent, args, { db }, info){
        const [user] = await db.users.findAll({ where: { id: parent.posterId}});
        return user;
    },
    async images(parent, args, { db }, info){
        const images = await db.images.findAll({ where: { id: parent.id }});
        return images;
    }
};

module.exports = Product;
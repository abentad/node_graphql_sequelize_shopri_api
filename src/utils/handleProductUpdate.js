const handleProductUpdate = (data, originalProduct) => {
    const d = {};
    data.isPending ? d.isPending = data.isPending : d.isPending = originalProduct.isPending;
    data.views ? d.views = data.views : d.views = originalProduct.views;
    data.name ? d.name = data.name : d.name = originalProduct.name;
    data.price ? d.price = data.price : d.price = originalProduct.price;
    data.description ? d.description = data.description : d.description = originalProduct.description;
    data.category ? d.category = data.category : d.category = originalProduct.category;
    data.image ? d.image = data.image : d.image = originalProduct.image;
    data.datePosted ? d.datePosted = data.datePosted : d.datePosted = originalProduct.datePosted;
    return d;
};

module.exports = handleProductUpdate;
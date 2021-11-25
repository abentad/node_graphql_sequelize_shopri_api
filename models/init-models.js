var DataTypes = require("sequelize").DataTypes;
var _conversations = require("./conversations");
var _images = require("./images");
var _messages = require("./messages");
var _products = require("./products");
var _users = require("./users");

function initModels(sequelize) {
  var conversations = _conversations(sequelize, DataTypes);
  var images = _images(sequelize, DataTypes);
  var messages = _messages(sequelize, DataTypes);
  var products = _products(sequelize, DataTypes);
  var users = _users(sequelize, DataTypes);

  messages.belongsTo(conversations, { as: "conversation", foreignKey: "conversationId"});
  conversations.hasMany(messages, { as: "messages", foreignKey: "conversationId"});
  images.belongsTo(products, { as: "id_product", foreignKey: "id"});
  products.hasMany(images, { as: "images", foreignKey: "id"});

  return {
    conversations,
    images,
    messages,
    products,
    users,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;

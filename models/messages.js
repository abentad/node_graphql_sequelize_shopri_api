const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('messages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'conversations',
        key: 'id'
      }
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    senderName: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    messageText: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    timeSent: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'messages',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "conversationId",
        using: "BTREE",
        fields: [
          { name: "conversationId" },
        ]
      },
    ]
  });
};

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conversations', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    senderName: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    receiverName: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    senderProfileUrl: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    receiverProfileUrl: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    lastMessage: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    lastMessageTimeSent: {
      type: DataTypes.STRING(80),
      allowNull: false
    },
    lastMessageSenderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'conversations',
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
    ]
  });
};

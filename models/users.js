const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('users', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    deviceToken: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    username: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    phoneNumber: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    password: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    profile_image: {
      type: DataTypes.STRING(80),
      allowNull: true
    },
    dateJoined: {
      type: DataTypes.STRING(80),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'users',
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

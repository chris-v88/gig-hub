const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Languages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: "name"
    },
    code: {
      type: DataTypes.STRING(5),
      allowNull: false,
      unique: "code"
    }
  }, {
    sequelize,
    tableName: 'Languages',
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
        name: "name",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "name" },
        ]
      },
      {
        name: "code",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "code" },
        ]
      },
    ]
  });
};

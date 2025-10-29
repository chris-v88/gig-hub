const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('User_languages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    language_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Languages',
        key: 'id'
      }
    },
    proficiency: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "basic"
    }
  }, {
    sequelize,
    tableName: 'User_languages',
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
        name: "user_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
          { name: "language_id" },
        ]
      },
      {
        name: "language_id",
        using: "BTREE",
        fields: [
          { name: "language_id" },
        ]
      },
    ]
  });
};

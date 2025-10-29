const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Gigs', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
    short_description: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Categories',
        key: 'id'
      }
    },
    subcategory_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Subcategories',
        key: 'id'
      }
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revisions: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "active"
    },
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: true
    },
    orders_completed: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    average_rating: {
      type: DataTypes.DECIMAL(3,2),
      allowNull: true,
      defaultValue: 0.00
    },
    total_reviews: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Gigs',
    timestamps: true,
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
        name: "seller_id",
        using: "BTREE",
        fields: [
          { name: "seller_id" },
        ]
      },
      {
        name: "category_id",
        using: "BTREE",
        fields: [
          { name: "category_id" },
        ]
      },
      {
        name: "subcategory_id",
        using: "BTREE",
        fields: [
          { name: "subcategory_id" },
        ]
      },
    ]
  });
};

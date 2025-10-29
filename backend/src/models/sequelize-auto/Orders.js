const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Orders', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    gig_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Gigs',
        key: 'id'
      }
    },
    seller_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    buyer_id: {
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
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    delivery_time: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    revisions_included: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    revisions_used: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: true,
      defaultValue: "pending"
    },
    hire_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'Orders',
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
        name: "gig_id",
        using: "BTREE",
        fields: [
          { name: "gig_id" },
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
        name: "buyer_id",
        using: "BTREE",
        fields: [
          { name: "buyer_id" },
        ]
      },
    ]
  });
};

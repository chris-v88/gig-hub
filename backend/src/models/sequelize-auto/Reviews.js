const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Reviews', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    gig_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Gigs',
        key: 'id'
      }
    },
    reviewer_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reviewee_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    reviewer_role: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    reviewee_role: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    communication_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    service_quality_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    delivery_time_rating: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    is_public: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 1
    },
    seller_response: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    review_date: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Reviews',
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
        name: "order_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "order_id" },
          { name: "reviewer_id" },
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
        name: "reviewer_id",
        using: "BTREE",
        fields: [
          { name: "reviewer_id" },
        ]
      },
      {
        name: "reviewee_id",
        using: "BTREE",
        fields: [
          { name: "reviewee_id" },
        ]
      },
    ]
  });
};

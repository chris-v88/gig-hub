const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chat', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id'
      }
    },
    participant1_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    participant2_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    last_message_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'Chat',
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
        name: "participant1_id",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "participant1_id" },
          { name: "participant2_id" },
          { name: "order_id" },
        ]
      },
      {
        name: "order_id",
        using: "BTREE",
        fields: [
          { name: "order_id" },
        ]
      },
      {
        name: "participant2_id",
        using: "BTREE",
        fields: [
          { name: "participant2_id" },
        ]
      },
    ]
  });
};

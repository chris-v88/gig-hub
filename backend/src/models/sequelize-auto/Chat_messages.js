const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Chat_messages', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    thread_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Chat',
        key: 'id'
      }
    },
    sender_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    attachments: {
      type: DataTypes.JSON,
      allowNull: true
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: 0
    }
  }, {
    sequelize,
    tableName: 'Chat_messages',
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
        name: "thread_id",
        using: "BTREE",
        fields: [
          { name: "thread_id" },
        ]
      },
      {
        name: "sender_id",
        using: "BTREE",
        fields: [
          { name: "sender_id" },
        ]
      },
    ]
  });
};

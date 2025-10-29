const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Gig_images', {
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
    image_url: {
      type: DataTypes.STRING(500),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'Gig_images',
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
        name: "gig_id",
        using: "BTREE",
        fields: [
          { name: "gig_id" },
        ]
      },
    ]
  });
};

const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const locations = sequelize.define(
    'locations',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      name: {
        type: DataTypes.TEXT,
      },

      address: {
        type: DataTypes.TEXT,
      },

      importHash: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
    },
    {
      timestamps: true,
      paranoid: true,
      freezeTableName: true,
    },
  );

  locations.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.locations.hasMany(db.time_slots, {
      as: 'time_slots_location',
      foreignKey: {
        name: 'locationId',
      },
      constraints: false,
    });

    //end loop

    db.locations.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.locations.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.locations.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return locations;
};

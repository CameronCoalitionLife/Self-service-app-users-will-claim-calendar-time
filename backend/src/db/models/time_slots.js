const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const time_slots = sequelize.define(
    'time_slots',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      start_time: {
        type: DataTypes.DATE,
      },

      end_time: {
        type: DataTypes.DATE,
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

  time_slots.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    db.time_slots.hasMany(db.bookings, {
      as: 'bookings_time_slot',
      foreignKey: {
        name: 'time_slotId',
      },
      constraints: false,
    });

    //end loop

    db.time_slots.belongsTo(db.locations, {
      as: 'location',
      foreignKey: {
        name: 'locationId',
      },
      constraints: false,
    });

    db.time_slots.belongsTo(db.users, {
      as: 'booked_by',
      foreignKey: {
        name: 'booked_byId',
      },
      constraints: false,
    });

    db.time_slots.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.time_slots.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.time_slots.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return time_slots;
};

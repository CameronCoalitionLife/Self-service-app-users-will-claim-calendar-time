const config = require('../../config');
const providers = config.providers;
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const moment = require('moment');

module.exports = function (sequelize, DataTypes) {
  const bookings = sequelize.define(
    'bookings',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      recurrence: {
        type: DataTypes.ENUM,

        values: ['one-time', 'weekly', 'bi-weekly', 'monthly'],
      },

      end_date: {
        type: DataTypes.DATE,
      },

      occurrences: {
        type: DataTypes.INTEGER,
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

  bookings.associate = (db) => {
    /// loop through entities and it's fields, and if ref === current e[name] and create relation has many on parent entity

    //end loop

    db.bookings.belongsTo(db.users, {
      as: 'user',
      foreignKey: {
        name: 'userId',
      },
      constraints: false,
    });

    db.bookings.belongsTo(db.time_slots, {
      as: 'time_slot',
      foreignKey: {
        name: 'time_slotId',
      },
      constraints: false,
    });

    db.bookings.belongsTo(db.organizations, {
      as: 'organization',
      foreignKey: {
        name: 'organizationId',
      },
      constraints: false,
    });

    db.bookings.belongsTo(db.users, {
      as: 'createdBy',
    });

    db.bookings.belongsTo(db.users, {
      as: 'updatedBy',
    });
  };

  return bookings;
};

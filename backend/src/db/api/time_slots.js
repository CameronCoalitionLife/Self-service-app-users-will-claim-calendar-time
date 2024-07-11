const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class Time_slotsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const time_slots = await db.time_slots.create(
      {
        id: data.id || undefined,

        start_time: data.start_time || null,
        end_time: data.end_time || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await time_slots.setLocation(data.location || null, {
      transaction,
    });

    await time_slots.setBooked_by(data.booked_by || null, {
      transaction,
    });

    await time_slots.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return time_slots;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const time_slotsData = data.map((item, index) => ({
      id: item.id || undefined,

      start_time: item.start_time || null,
      end_time: item.end_time || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const time_slots = await db.time_slots.bulkCreate(time_slotsData, {
      transaction,
    });

    // For each item created, replace relation files

    return time_slots;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const time_slots = await db.time_slots.findByPk(id, {}, { transaction });

    await time_slots.update(
      {
        start_time: data.start_time || null,
        end_time: data.end_time || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await time_slots.setLocation(data.location || null, {
      transaction,
    });

    await time_slots.setBooked_by(data.booked_by || null, {
      transaction,
    });

    await time_slots.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return time_slots;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const time_slots = await db.time_slots.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of time_slots) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of time_slots) {
        await record.destroy({ transaction });
      }
    });

    return time_slots;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const time_slots = await db.time_slots.findByPk(id, options);

    await time_slots.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await time_slots.destroy({
      transaction,
    });

    return time_slots;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const time_slots = await db.time_slots.findOne({ where }, { transaction });

    if (!time_slots) {
      return time_slots;
    }

    const output = time_slots.get({ plain: true });

    output.bookings_time_slot = await time_slots.getBookings_time_slot({
      transaction,
    });

    output.location = await time_slots.getLocation({
      transaction,
    });

    output.booked_by = await time_slots.getBooked_by({
      transaction,
    });

    output.organization = await time_slots.getOrganization({
      transaction,
    });

    return output;
  }

  static async findAll(filter, globalAccess, options) {
    var limit = filter.limit || 0;
    var offset = 0;
    const currentPage = +filter.page;

    offset = currentPage * limit;

    var orderBy = null;

    const transaction = (options && options.transaction) || undefined;
    let where = {};
    let include = [
      {
        model: db.locations,
        as: 'location',
      },

      {
        model: db.users,
        as: 'booked_by',
      },

      {
        model: db.organizations,
        as: 'organization',
      },
    ];

    if (filter) {
      if (filter.id) {
        where = {
          ...where,
          ['id']: Utils.uuid(filter.id),
        };
      }

      if (filter.calendarStart && filter.calendarEnd) {
        where = {
          ...where,
          [Op.or]: [
            {
              start_time: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
            {
              end_time: {
                [Op.between]: [filter.calendarStart, filter.calendarEnd],
              },
            },
          ],
        };
      }

      if (filter.start_timeRange) {
        const [start, end] = filter.start_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            start_time: {
              ...where.start_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            start_time: {
              ...where.start_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.end_timeRange) {
        const [start, end] = filter.end_timeRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_time: {
              ...where.end_time,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_time: {
              ...where.end_time,
              [Op.lte]: end,
            },
          };
        }
      }

      if (
        filter.active === true ||
        filter.active === 'true' ||
        filter.active === false ||
        filter.active === 'false'
      ) {
        where = {
          ...where,
          active: filter.active === true || filter.active === 'true',
        };
      }

      if (filter.location) {
        var listItems = filter.location.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          locationId: { [Op.or]: listItems },
        };
      }

      if (filter.booked_by) {
        var listItems = filter.booked_by.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          booked_byId: { [Op.or]: listItems },
        };
      }

      if (filter.organization) {
        var listItems = filter.organization.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          organizationId: { [Op.or]: listItems },
        };
      }

      if (filter.createdAtRange) {
        const [start, end] = filter.createdAtRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            ['createdAt']: {
              ...where.createdAt,
              [Op.lte]: end,
            },
          };
        }
      }
    }

    let { rows, count } = options?.countOnly
      ? {
          rows: [],
          count: await db.time_slots.count({
            where: globalAccess ? {} : where,
            include,
            distinct: true,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
            order:
              filter.field && filter.sort
                ? [[filter.field, filter.sort]]
                : [['createdAt', 'desc']],
            transaction,
          }),
        }
      : await db.time_slots.findAndCountAll({
          where: globalAccess ? {} : where,
          include,
          distinct: true,
          limit: limit ? Number(limit) : undefined,
          offset: offset ? Number(offset) : undefined,
          order:
            filter.field && filter.sort
              ? [[filter.field, filter.sort]]
              : [['createdAt', 'desc']],
          transaction,
        });

    //    rows = await this._fillWithRelationsAndFilesForRows(
    //      rows,
    //      options,
    //    );

    return { rows, count };
  }

  static async findAllAutocomplete(query, limit, globalAccess, organizationId) {
    let where = {};

    if (!globalAccess && organizationId) {
      where.organizationId = organizationId;
    }

    if (query) {
      where = {
        [Op.or]: [
          { ['id']: Utils.uuid(query) },
          Utils.ilike('time_slots', 'start_time', query),
        ],
      };
    }

    const records = await db.time_slots.findAll({
      attributes: ['id', 'start_time'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['start_time', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.start_time,
    }));
  }
};

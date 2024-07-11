const db = require('../models');
const FileDBApi = require('./file');
const crypto = require('crypto');
const Utils = require('../utils');

const Sequelize = db.Sequelize;
const Op = Sequelize.Op;

module.exports = class BookingsDBApi {
  static async create(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const bookings = await db.bookings.create(
      {
        id: data.id || undefined,

        recurrence: data.recurrence || null,
        end_date: data.end_date || null,
        occurrences: data.occurrences || null,
        importHash: data.importHash || null,
        createdById: currentUser.id,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await bookings.setUser(data.user || null, {
      transaction,
    });

    await bookings.setTime_slot(data.time_slot || null, {
      transaction,
    });

    await bookings.setOrganization(currentUser.organization.id || null, {
      transaction,
    });

    return bookings;
  }

  static async bulkImport(data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    // Prepare data - wrapping individual data transformations in a map() method
    const bookingsData = data.map((item, index) => ({
      id: item.id || undefined,

      recurrence: item.recurrence || null,
      end_date: item.end_date || null,
      occurrences: item.occurrences || null,
      importHash: item.importHash || null,
      createdById: currentUser.id,
      updatedById: currentUser.id,
      createdAt: new Date(Date.now() + index * 1000),
    }));

    // Bulk create items
    const bookings = await db.bookings.bulkCreate(bookingsData, {
      transaction,
    });

    // For each item created, replace relation files

    return bookings;
  }

  static async update(id, data, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;
    const globalAccess = currentUser.app_role?.globalAccess;

    const bookings = await db.bookings.findByPk(id, {}, { transaction });

    await bookings.update(
      {
        recurrence: data.recurrence || null,
        end_date: data.end_date || null,
        occurrences: data.occurrences || null,
        updatedById: currentUser.id,
      },
      { transaction },
    );

    await bookings.setUser(data.user || null, {
      transaction,
    });

    await bookings.setTime_slot(data.time_slot || null, {
      transaction,
    });

    await bookings.setOrganization(
      (globalAccess ? data.organization : currentUser.organization.id) || null,
      {
        transaction,
      },
    );

    return bookings;
  }

  static async deleteByIds(ids, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const bookings = await db.bookings.findAll({
      where: {
        id: {
          [Op.in]: ids,
        },
      },
      transaction,
    });

    await db.sequelize.transaction(async (transaction) => {
      for (const record of bookings) {
        await record.update({ deletedBy: currentUser.id }, { transaction });
      }
      for (const record of bookings) {
        await record.destroy({ transaction });
      }
    });

    return bookings;
  }

  static async remove(id, options) {
    const currentUser = (options && options.currentUser) || { id: null };
    const transaction = (options && options.transaction) || undefined;

    const bookings = await db.bookings.findByPk(id, options);

    await bookings.update(
      {
        deletedBy: currentUser.id,
      },
      {
        transaction,
      },
    );

    await bookings.destroy({
      transaction,
    });

    return bookings;
  }

  static async findBy(where, options) {
    const transaction = (options && options.transaction) || undefined;

    const bookings = await db.bookings.findOne({ where }, { transaction });

    if (!bookings) {
      return bookings;
    }

    const output = bookings.get({ plain: true });

    output.user = await bookings.getUser({
      transaction,
    });

    output.time_slot = await bookings.getTime_slot({
      transaction,
    });

    output.organization = await bookings.getOrganization({
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
        model: db.users,
        as: 'user',
      },

      {
        model: db.time_slots,
        as: 'time_slot',
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

      if (filter.end_dateRange) {
        const [start, end] = filter.end_dateRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            end_date: {
              ...where.end_date,
              [Op.lte]: end,
            },
          };
        }
      }

      if (filter.occurrencesRange) {
        const [start, end] = filter.occurrencesRange;

        if (start !== undefined && start !== null && start !== '') {
          where = {
            ...where,
            occurrences: {
              ...where.occurrences,
              [Op.gte]: start,
            },
          };
        }

        if (end !== undefined && end !== null && end !== '') {
          where = {
            ...where,
            occurrences: {
              ...where.occurrences,
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

      if (filter.recurrence) {
        where = {
          ...where,
          recurrence: filter.recurrence,
        };
      }

      if (filter.user) {
        var listItems = filter.user.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          userId: { [Op.or]: listItems },
        };
      }

      if (filter.time_slot) {
        var listItems = filter.time_slot.split('|').map((item) => {
          return Utils.uuid(item);
        });

        where = {
          ...where,
          time_slotId: { [Op.or]: listItems },
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
          count: await db.bookings.count({
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
      : await db.bookings.findAndCountAll({
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
          Utils.ilike('bookings', 'user', query),
        ],
      };
    }

    const records = await db.bookings.findAll({
      attributes: ['id', 'user'],
      where,
      limit: limit ? Number(limit) : undefined,
      orderBy: [['user', 'ASC']],
    });

    return records.map((record) => ({
      id: record.id,
      label: record.user,
    }));
  }
};

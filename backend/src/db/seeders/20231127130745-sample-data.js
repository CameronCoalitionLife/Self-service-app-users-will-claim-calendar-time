const db = require('../models');
const Users = db.users;

const Bookings = db.bookings;

const Locations = db.locations;

const Notifications = db.notifications;

const TimeSlots = db.time_slots;

const Organizations = db.organizations;

const BookingsData = [
  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    recurrence: 'monthly',

    end_date: new Date('2023-10-01T11:00:00Z'),

    occurrences: 1,

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    recurrence: 'weekly',

    end_date: new Date('2023-12-02T13:00:00Z'),

    occurrences: 8,

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    // type code here for "relation_one" field

    recurrence: 'monthly',

    end_date: new Date('2023-12-03T12:00:00Z'),

    occurrences: 4,

    // type code here for "relation_one" field
  },
];

const LocationsData = [
  {
    name: 'Community Center',

    address: '123 Main St, Anytown, USA',

    // type code here for "relation_one" field
  },

  {
    name: 'Local Library',

    address: '456 Elm St, Anytown, USA',

    // type code here for "relation_one" field
  },

  {
    name: 'Food Bank',

    address: '789 Oak St, Anytown, USA',

    // type code here for "relation_one" field
  },
];

const NotificationsData = [
  {
    // type code here for "relation_one" field

    message:
      'Your booking for the Community Center on 2023-10-01 has been confirmed.',

    sent_at: new Date('2023-09-30T12:00:00Z'),

    type: 'in-app',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    message:
      'Reminder: Your volunteer slot at the Local Library is tomorrow at 1 PM.',

    sent_at: new Date('2023-10-01T12:00:00Z'),

    type: 'email',

    // type code here for "relation_one" field
  },

  {
    // type code here for "relation_one" field

    message: 'Your booking for the Food Bank on 2023-10-03 has been confirmed.',

    sent_at: new Date('2023-10-02T12:00:00Z'),

    type: 'email',

    // type code here for "relation_one" field
  },
];

const TimeSlotsData = [
  {
    start_time: new Date('2023-10-01T09:00:00Z'),

    end_time: new Date('2023-10-01T11:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    start_time: new Date('2023-10-02T13:00:00Z'),

    end_time: new Date('2023-10-02T15:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },

  {
    start_time: new Date('2023-10-03T10:00:00Z'),

    end_time: new Date('2023-10-03T12:00:00Z'),

    // type code here for "relation_one" field

    // type code here for "relation_one" field

    // type code here for "relation_one" field
  },
];

const OrganizationsData = [
  {
    name: 'Claude Bernard',
  },

  {
    name: 'Marie Curie',
  },

  {
    name: 'Justus Liebig',
  },
];

// Similar logic for "relation_many"

async function associateUserWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User0 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (User0?.setOrganization) {
    await User0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User1 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (User1?.setOrganization) {
    await User1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const User2 = await Users.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (User2?.setOrganization) {
    await User2.setOrganization(relatedOrganization2);
  }
}

async function associateBookingWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Booking0 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Booking0?.setUser) {
    await Booking0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Booking1 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Booking1?.setUser) {
    await Booking1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Booking2 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Booking2?.setUser) {
    await Booking2.setUser(relatedUser2);
  }
}

async function associateBookingWithTime_slot() {
  const relatedTime_slot0 = await TimeSlots.findOne({
    offset: Math.floor(Math.random() * (await TimeSlots.count())),
  });
  const Booking0 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Booking0?.setTime_slot) {
    await Booking0.setTime_slot(relatedTime_slot0);
  }

  const relatedTime_slot1 = await TimeSlots.findOne({
    offset: Math.floor(Math.random() * (await TimeSlots.count())),
  });
  const Booking1 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Booking1?.setTime_slot) {
    await Booking1.setTime_slot(relatedTime_slot1);
  }

  const relatedTime_slot2 = await TimeSlots.findOne({
    offset: Math.floor(Math.random() * (await TimeSlots.count())),
  });
  const Booking2 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Booking2?.setTime_slot) {
    await Booking2.setTime_slot(relatedTime_slot2);
  }
}

async function associateBookingWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Booking0 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Booking0?.setOrganization) {
    await Booking0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Booking1 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Booking1?.setOrganization) {
    await Booking1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Booking2 = await Bookings.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Booking2?.setOrganization) {
    await Booking2.setOrganization(relatedOrganization2);
  }
}

async function associateLocationWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Location0 = await Locations.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Location0?.setOrganization) {
    await Location0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Location1 = await Locations.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Location1?.setOrganization) {
    await Location1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Location2 = await Locations.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Location2?.setOrganization) {
    await Location2.setOrganization(relatedOrganization2);
  }
}

async function associateNotificationWithUser() {
  const relatedUser0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification0 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Notification0?.setUser) {
    await Notification0.setUser(relatedUser0);
  }

  const relatedUser1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification1 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Notification1?.setUser) {
    await Notification1.setUser(relatedUser1);
  }

  const relatedUser2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const Notification2 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Notification2?.setUser) {
    await Notification2.setUser(relatedUser2);
  }
}

async function associateNotificationWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification0 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (Notification0?.setOrganization) {
    await Notification0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification1 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (Notification1?.setOrganization) {
    await Notification1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const Notification2 = await Notifications.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (Notification2?.setOrganization) {
    await Notification2.setOrganization(relatedOrganization2);
  }
}

async function associateTimeSlotWithLocation() {
  const relatedLocation0 = await Locations.findOne({
    offset: Math.floor(Math.random() * (await Locations.count())),
  });
  const TimeSlot0 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (TimeSlot0?.setLocation) {
    await TimeSlot0.setLocation(relatedLocation0);
  }

  const relatedLocation1 = await Locations.findOne({
    offset: Math.floor(Math.random() * (await Locations.count())),
  });
  const TimeSlot1 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (TimeSlot1?.setLocation) {
    await TimeSlot1.setLocation(relatedLocation1);
  }

  const relatedLocation2 = await Locations.findOne({
    offset: Math.floor(Math.random() * (await Locations.count())),
  });
  const TimeSlot2 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (TimeSlot2?.setLocation) {
    await TimeSlot2.setLocation(relatedLocation2);
  }
}

async function associateTimeSlotWithBooked_by() {
  const relatedBooked_by0 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const TimeSlot0 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (TimeSlot0?.setBooked_by) {
    await TimeSlot0.setBooked_by(relatedBooked_by0);
  }

  const relatedBooked_by1 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const TimeSlot1 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (TimeSlot1?.setBooked_by) {
    await TimeSlot1.setBooked_by(relatedBooked_by1);
  }

  const relatedBooked_by2 = await Users.findOne({
    offset: Math.floor(Math.random() * (await Users.count())),
  });
  const TimeSlot2 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (TimeSlot2?.setBooked_by) {
    await TimeSlot2.setBooked_by(relatedBooked_by2);
  }
}

async function associateTimeSlotWithOrganization() {
  const relatedOrganization0 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const TimeSlot0 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 0,
  });
  if (TimeSlot0?.setOrganization) {
    await TimeSlot0.setOrganization(relatedOrganization0);
  }

  const relatedOrganization1 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const TimeSlot1 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 1,
  });
  if (TimeSlot1?.setOrganization) {
    await TimeSlot1.setOrganization(relatedOrganization1);
  }

  const relatedOrganization2 = await Organizations.findOne({
    offset: Math.floor(Math.random() * (await Organizations.count())),
  });
  const TimeSlot2 = await TimeSlots.findOne({
    order: [['id', 'ASC']],
    offset: 2,
  });
  if (TimeSlot2?.setOrganization) {
    await TimeSlot2.setOrganization(relatedOrganization2);
  }
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Bookings.bulkCreate(BookingsData);

    await Locations.bulkCreate(LocationsData);

    await Notifications.bulkCreate(NotificationsData);

    await TimeSlots.bulkCreate(TimeSlotsData);

    await Organizations.bulkCreate(OrganizationsData);

    await Promise.all([
      // Similar logic for "relation_many"

      await associateUserWithOrganization(),

      await associateBookingWithUser(),

      await associateBookingWithTime_slot(),

      await associateBookingWithOrganization(),

      await associateLocationWithOrganization(),

      await associateNotificationWithUser(),

      await associateNotificationWithOrganization(),

      await associateTimeSlotWithLocation(),

      await associateTimeSlotWithBooked_by(),

      await associateTimeSlotWithOrganization(),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('bookings', null, {});

    await queryInterface.bulkDelete('locations', null, {});

    await queryInterface.bulkDelete('notifications', null, {});

    await queryInterface.bulkDelete('time_slots', null, {});

    await queryInterface.bulkDelete('organizations', null, {});
  },
};

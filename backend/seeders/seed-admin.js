const bcrypt = require('bcrypt');
const { sequelize, User, Store } = require('../models');

(async () => {
  try {
    await sequelize.sync({ force: false }); // don't drop existing
    // check admin exists
    let admin = await User.findOne({ where: { email: 'admin@example.com' }});
    if (!admin) {
      const hash = await bcrypt.hash('Admin@1234', 10);
      admin = await User.create({ name: 'System Administrator Default AdminUser', email: 'admin@example.com', password: hash, address: 'HQ Address', role: 'ADMIN' });
      console.log('Admin created -> email: admin@example.com password: Admin@1234');
    } else {
      console.log('Admin exists');
    }
    // create a store owner
    let owner = await User.findOne({ where: { email: 'owner@example.com' }});
    if (!owner) {
      const ohash = await bcrypt.hash('Owner@1234', 10);
      owner = await User.create({ name: 'Store Owner Default SampleOwner', email: 'owner@example.com', password: ohash, address: 'Owner Address', role: 'OWNER' });
      console.log('Owner created -> owner@example.com / Owner@1234');
    }
    let store = await Store.findOne({ where: { name: 'Test Store One' }});
    if (!store) {
      store = await Store.create({ name: 'Test Store One', email: 'store1@example.com', address: 'Some address here', owner_id: owner.id});
      console.log('Sample store created');
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();

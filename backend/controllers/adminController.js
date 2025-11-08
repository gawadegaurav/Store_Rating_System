const { User, Store, Rating, sequelize } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

const dashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalStores = await Store.count();
    const totalRatings = await Rating.count();
    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

const addUser = async (req, res) => {
  // Admin can add user/admin with role param
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, password, address, role } = req.body;
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hash, address, role: role || 'USER' });
    res.json({ message: 'User added', user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role } });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

const listStores = async (req, res) => {
  // filters: name, email, address
  const { name, email, address, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating'] }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit)
    });

    // calculate average rating
    const storesWithRating = stores.map(s => {
      const ratings = s.ratings.map(r => r.rating);
      const avg = ratings.length ? (ratings.reduce((a,b)=>a+b,0)/ratings.length).toFixed(2) : null;
      return {
        id: s.id, name: s.name, email: s.email, address: s.address, averageRating: avg
      };
    });
    res.json(storesWithRating);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

const listUsers = async (req, res) => {
  const { name, email, address, role, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (email) where.email = { [Op.like]: `%${email}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };
  if (role) where.role = role;

  try {
    const users = await User.findAll({
      where,
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit)
    });

    // If store owner, include their average rating
    const usersWithRatings = await Promise.all(users.map(async u => {
      if (u.role === 'OWNER') {
        // compute average rating across the owner's stores
        const stores = await Store.findAll({ where: { owner_id: u.id }, include: ['ratings'] });
        const allRatings = [];
        stores.forEach(s => s.ratings.forEach(r => allRatings.push(r.rating)));
        const avg = allRatings.length ? (allRatings.reduce((a,b)=>a+b,0)/allRatings.length).toFixed(2) : null;
        return { id: u.id, name: u.name, email: u.email, address: u.address, role: u.role, ownerRating: avg };
      }
      return { id: u.id, name: u.name, email: u.email, address: u.address, role: u.role };
    }));

    res.json(usersWithRatings);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

const viewUserDetails = async (req, res) => {
  try {
    const uid = req.params.id;
    const user = await User.findByPk(uid, { include: [{ model: Store, as: 'stores', include: ['ratings'] }, { model: Rating, as: 'ratings' }] });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let ownerRating = null;
    if (user.role === 'OWNER') {
      // compute rating across owned stores
      const all = [];
      user.stores.forEach(s => s.ratings.forEach(r => all.push(r.rating)));
      ownerRating = all.length ? (all.reduce((a,b)=>a+b,0)/all.length).toFixed(2) : null;
    }
    res.json({
      id: user.id, name: user.name, email: user.email, address: user.address, role: user.role, ownerRating
    });
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { dashboard, addUser, listStores, listUsers, viewUserDetails };

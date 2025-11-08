const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

const listAllStores = async (req, res) => {
  const { name, address, sortBy='name', order='ASC', page=1, limit=20 } = req.query;
  const where = {};
  if (name) where.name = { [Op.like]: `%${name}%` };
  if (address) where.address = { [Op.like]: `%${address}%` };

  try {
    const stores = await Store.findAll({
      where,
      include: [{ model: Rating, as: 'ratings', attributes: ['rating', 'user_id'] }],
      order: [[sortBy, order]],
      limit: parseInt(limit),
      offset: (parseInt(page)-1)*parseInt(limit)
    });

    // prepare output with user's submitted rating if user-id provided
    const userId = req.user ? req.user.id : null;
    const result = stores.map(s => {
      const ratingsArr = s.ratings.map(r=>r.rating);
      const avg = ratingsArr.length ? (ratingsArr.reduce((a,b)=>a+b,0)/ratingsArr.length).toFixed(2) : null;
      const userRatingObj = s.ratings.find(r => r.user_id === userId);
      return {
        id: s.id,
        name: s.name,
        address: s.address,
        averageRating: avg,
        userRating: userRatingObj ? userRatingObj.rating : null
      };
    });
    res.json(result);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

const ownerStoresRatings = async (req, res) => {
  // for store owner: list users who rated their store
  try {
    const ownerId = req.user.id;
    // find stores owned by this owner
    const stores = await Store.findAll({ where: { owner_id: ownerId }, include: [{ model: Rating, as: 'ratings', include: [{ model: User, as: 'user', attributes: ['id','name','email'] }] }] });
    const payload = stores.map(s => {
      const avg = s.ratings.length ? (s.ratings.reduce((a,b)=>a+b.rating,0)/s.ratings.length).toFixed(2) : null;
      return {
        storeId: s.id,
        storeName: s.name,
        averageRating: avg,
        ratings: s.ratings.map(r => ({ userId: r.user.id, userName: r.user.name, userEmail: r.user.email, rating: r.rating }))
      }
    });
    res.json(payload);
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { listAllStores, ownerStoresRatings };

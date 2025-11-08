const { Store, Rating, User } = require('../models');
const { Op } = require('sequelize');

const submitRating = async (req, res) => {
  const userId = req.user.id;
  const { storeId, rating } = req.body;
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return res.status(400).json({ message: 'Rating must be integer 1-5' });
  try {
    // upsert (create or update existing)
    const existing = await Rating.findOne({ where: { user_id: userId, store_id: storeId } });
    if (existing) {
      existing.rating = rating;
      await existing.save();
      return res.json({ message: 'Rating updated', rating: existing });
    } else {
      const newRating = await Rating.create({ user_id: userId, store_id: storeId, rating });
      return res.json({ message: 'Rating submitted', rating: newRating });
    }
  } catch (err) {
    console.error(err); res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitRating };

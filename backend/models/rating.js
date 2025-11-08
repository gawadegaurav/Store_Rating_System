module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Rating', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    store_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } }
  }, {
    tableName: 'ratings',
    indexes: [{ unique: true, fields: ['user_id', 'store_id'] }]
  });
};

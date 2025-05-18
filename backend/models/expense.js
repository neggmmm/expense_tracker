const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./user');

class Expense extends Model {}

Expense.init(
  {
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: { min: 0 }
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    sequelize,
    modelName: 'Expense'
  }
);

// Set up association
Expense.belongsTo(User, { foreignKey: 'UserId', onDelete: 'CASCADE' });
User.hasMany(Expense, { foreignKey: 'UserId' });

module.exports = Expense;
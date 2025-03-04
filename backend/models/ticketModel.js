const { DataTypes } = require('sequelize');
const User = require('./userModel');
const sequelize = require('../config/db').sequelize;

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  is_archived: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  product: {
    type: DataTypes.ENUM('iPhone', 'iPad', 'MacBook', 'Macbook Pro', 'iMac', 'iPod', 'iPod touch'),
    allowNull: false,
    validate: { notEmpty: { msg: 'Please select a product' } },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Please enter a description of the issue' } },
  },
  status: {
    type: DataTypes.ENUM('new', 'open', 'close'),
    allowNull: false,
    defaultValue: 'new',
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'tickets',
});

Ticket.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Ticket;
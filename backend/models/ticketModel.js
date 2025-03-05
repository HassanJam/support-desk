const { DataTypes } = require('sequelize');
const User = require('./userModel');
const sequelize = require('../config/db').sequelize;

const Ticket = sequelize.define('Ticket', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
  issue: {
    type: DataTypes.ENUM('Client Regarding', 'Client Biometric', 'External Extension', 'Network', 'Internet', 'Phone', 'Software Training', 'Mobile Application', 'Video Call', 'Audio Minutes'),
    allowNull: false,
    validate: { notEmpty: { msg: 'Please select a issue' } },
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
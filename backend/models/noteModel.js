const { DataTypes } = require('sequelize');
const User = require('./userModel');
const sequelize = require('../config/db').sequelize;

const Note = sequelize.define('Note', {
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
  ticket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'tickets', key: 'id' },
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: { notEmpty: { msg: 'Please add some text' } },
  },
  is_staff: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  staff_id: {
    type: DataTypes.STRING,
    allowNull: true, // Not required in the original schema
  },
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  tableName: 'notes',
});

Note.belongsTo(User, { foreignKey: "user_id", as: "user" });

module.exports = Note;
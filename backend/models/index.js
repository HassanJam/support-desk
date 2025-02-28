const sequelize = require('../config/db').sequelize;
const User = require('./userModel');
const Ticket = require('./ticketModel');
const Note = require('./noteModel');

User.hasMany(Ticket, { foreignKey: 'user_id' });
Ticket.belongsTo(User, { foreignKey: 'user_id' });

User.hasMany(Note, { foreignKey: 'user_id' });
Note.belongsTo(User, { foreignKey: 'user_id' });

Ticket.hasMany(Note, { foreignKey: 'ticket_id' });
Note.belongsTo(Ticket, { foreignKey: 'ticket_id' });

module.exports = { User, Ticket, Note };
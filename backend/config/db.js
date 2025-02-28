const { Sequelize } = require('sequelize');
require('dotenv').config(); // If not already present, install: npm install dotenv

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE || 'SupportDesk',
  process.env.MYSQL_USER || 'root',
  process.env.MYSQL_PASSWORD || '12345678',
  {
    host: process.env.MYSQL_HOST || 'localhost',
    dialect: 'mysql',
    logging: false, // Set to true if you want SQL query logs
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connected'.cyan.underline.bold);
  } catch (error) {
    console.log(`Error: ${error.message}`.red.underline.bold);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };
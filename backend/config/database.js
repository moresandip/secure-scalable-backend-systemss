const { syncDatabase } = require('../models/memory.db');

module.exports = { sequelize: {}, connectDB: syncDatabase };

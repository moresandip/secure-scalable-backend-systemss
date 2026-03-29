const db = require('./memory.db');

const User = {
  create: db.User.create,
  findOne: db.User.findOne,
  findByPk: db.User.findByPk,
  findAll: db.User.findAll,
  comparePassword: db.User.comparePassword,
  prototype: {
    comparePassword: async function(password) {
      return db.User.comparePassword(this, password);
    }
  }
};

module.exports = User;

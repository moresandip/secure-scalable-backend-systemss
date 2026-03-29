const db = require('./memory.db');

const Task = {
  create: db.Task.create,
  findAndCountAll: db.Task.findAndCountAll,
  findByPk: db.Task.findByPk,
  update: async function(data, where) {
    return db.Task.update(data, { where });
  },
  destroy: async function(where) {
    return db.Task.destroy({ where });
  }
};

module.exports = Task;

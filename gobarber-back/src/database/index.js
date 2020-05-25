const Sequelize = require('sequelize');
const Mongoose = require('mongoose');

const User = require('../app/models/User');
const Students = require('../app/models/Student');
const Appointment = require('../app/models/Appointment');
const File = require('../app/models/File');
const databaseConfig = require('../config/database');

const models = [User, Students, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }

  mongo() {
    this.mongoConnection = Mongoose.connect(process.env.MONGO_URL, {
      userNewUrlParser: true,
      useFindAndModify: true,
    });
  }
}

module.exports = new Database();

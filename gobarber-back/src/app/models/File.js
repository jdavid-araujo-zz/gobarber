const Sequelize = require('sequelize');
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');

class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
        url: {
          type: Sequelize.VIRTUAL,
          get() {
            return `http://localhost:3333/files/${this.path}`;
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  checkPassword(password) {
    return bcrypt.compare(password, this.password_hash);
  }
}

module.exports = File;

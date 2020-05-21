const HttpStatus = require('http-status-codes');

const Student = require('../models/Student');

class StudentController {
  async store(req, res) {
    const studentsExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentsExists) {
      return res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ error: 'Student Already exists.' });
    }

    const { name, email, age, weight, height } = await Student.create(req.body);

    return res.json({ name, email, age, weight, height });
  }

  async update(req, res) {
    const { email } = req.body;

    const student = await Student.findByPk(req.id);

    if (email !== student.email) {
      const studentExists = await Student.findOne({ where: { email } });

      if (studentExists) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'Email already registred.' });
      }
    }

    const { name, age, weight, height } = await student.update(req.body);

    return res.json({ name, email, age, weight, height });
  }
}

module.exports = new StudentController();

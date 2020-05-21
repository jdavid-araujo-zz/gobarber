const Yup = require('yup');
const HttpStatus = require('http-status-codes');

const User = require('../models/User');

class UserController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email.required(),
      oldPassword: Yup.string().required().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!(await schema.isValid(res.body))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res
        .status(HttpStatus.BAD_GATEWAY)
        .json({ error: 'User Already exists.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res
          .status(HttpStatus.BAD_REQUEST)
          .json({ error: 'User Already exists.' });
      }
    }

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

module.exports = new UserController();

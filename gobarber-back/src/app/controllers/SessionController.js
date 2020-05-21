const jwt = require('jsonwebtoken');
const Yup = require('yup');
const HttpStatus = require('http-status-codes');

const User = require('../models/User');
const authConfig = require('../../config/auth');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string().email.required(),
      password: Yup.string().min(6).required(),
    });

    if (!(await schema.isValid(res.body))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'User not found' });
    }

    if (!(await user.checkPassword(password))) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'Passord does not found' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new SessionController();

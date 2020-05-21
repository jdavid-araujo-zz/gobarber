const Yup = require('yup');
const HttpStatus = require('http-status-codes');
const { startOfHour, parseISO, isBefore } = require('date-fns');

const User = require('../models/User');
const File = require('../models/File');

const Appointment = require('../models/Appointment');

class AppointmentController {
  async index(req, res) {
    const appointments = await Appointment.findAll({
      where: { user_id: req.user_id, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async sore(req, res) {
    const schema = Yup.object().shape({
      provide_id: Yup.number().required(),
      date: Yup.date.required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Validation fails' });
    }

    const { provider_id, date } = req.body;

    const isProvider = await User.findOne({
      where: { id: provider_id, isProvider: true },
    });

    if (!isProvider) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'You can only create appointments with providers' });
    }

    /**
     * Check for past dates
     */
    const hourStart = startOfHour(parseISO(date));

    if (isBefore(hourStart, new Date())) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Past dates are not permitted' });
    }

    /**
     * Check date availability
     */
    const checkAvailaability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailaability) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.user_id,
      provider_id,
      date: hourStart,
    });

    return res.json(appointment);
  }
}

module.exports = new AppointmentController();

const HttpStatus = require('http-status-codes');

const User = require('../models/User');
const Notification = require('../schemas/Notification');

class NotificationController {
  async index(req, res) {
    const checkIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkIsProvider) {
      return res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ error: 'You can only create appointments with providers' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);

    return res.json(notifications);
  }

  async update(req, res) {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id },
      { read: true },
      { new: true }
    );

    return res.json(notification);
  }
}

module.exports = new NotificationController();

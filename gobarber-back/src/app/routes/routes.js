const { Router } = require('express');

const multer = require('multer');
const multerConfig = require('../../config/multer');
const UserController = require('../controllers/UserController');
const StudentsController = require('../controllers/StudentController');
const SessionController = require('../controllers/SessionController');
const AppointmentController = require('../controllers/AppointmentController');
const ProviderController = require('../controllers/ProviderController');
const AvailableController = require('../controllers/AvailableController');
const ScheduleController = require('../controllers/ScheduleController');
const FileController = require('../controllers/FileController');
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middlewares/auth');

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/students', StudentsController.store);
routes.put('/students', StudentsController.update);

routes.get('/providers', ProviderController.index);
routes.get('/providers/:providerId/available', AvailableController.index);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);
routes.delete('/appointments/:id', AppointmentController.delete);

routes.get('/schedule', ScheduleController.index);

routes.get('/notifications', NotificationController.index);
routes.put('/notifications/:id', NotificationController.update);

routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;

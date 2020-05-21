const { Router } = require('express');

const multer = require('multer');
const multerConfig = require('../../config/multer');
const UserController = require('../controllers/UserController');
const StudentsController = require('../controllers/StudentController');
const SessionController = require('../controllers/SessionController');
const AppointmentController = require('../controllers/AppointmentController');
const ProviderController = require('../controllers/ProviderController');
const FileController = require('../controllers/FileController');
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

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.post('/files', upload.single('file'), FileController.store);

module.exports = routes;

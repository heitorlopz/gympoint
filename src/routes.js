import { Router } from 'express';
import UserController from './app/controllers/UserController';
import StudentController from './app/controllers/StudentController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// routes.get('/', (req, res) => res.json({ message: 'Hello World!' }));
// routes.post('/users', UserController.store);
// routes.post('/sessions', SessionController.store);

// como o authmiddleware ta sendo definido depois das rotas post, ele so vai valer para as seguintes <-> middleware global
// routes.use(authMiddleware);

// routes.put('/users', UserController.update);

// toda operação que fazemos no banco de dados é assincrona, ou seja, não acontece em tempo real, então precisamos utilizar o async/await
routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

export default routes;

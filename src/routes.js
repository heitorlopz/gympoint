import { Router } from 'express';
// import UserController from './app/controllers/UserController';
// import SessiosnController from './app/controllers/SessionController';

// import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.get('/', (req, res) => res.json({ message: 'Hello World!' }));
// routes.post('/users', UserController.store);
// routes.post('/sessions', SessionController.store);

// como o authmiddleware ta sendo definido depois das rotas post, ele so vai valer para as seguintes <-> middleware global
// routes.use(authMiddleware);

// routes.put('/users', UserController.update);

// toda operação que fazemos no banco de dados é assincrona, ou seja, não acontece em tempo real, então precisamos utilizar o async/await
/*  routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Heitor',
    email: 'fheitorlopes@gmail.com',
    password_hash: '232321321',
  });
  return res.json(user);
}); */

export default routes;

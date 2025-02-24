import Router from 'express';
import { GetUser, GetUsers, CreateUser } from '../controllers/user.controller.js';
import authorize from '../middlewares/auth.middleware.js';

const userRouter = Router();

userRouter.get('/', GetUsers);

userRouter.get('/:id', authorize, GetUser);

userRouter.post('/', CreateUser);

userRouter.put('/:id', (req, res) => {
    res.send({title: 'UPDATE user by id'});
})

userRouter.delete('/:id', (req, res) => {
    res.send({title: 'DELETE user by id'});
})

export default userRouter;
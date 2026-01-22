import { Router } from 'express';
import { signUp, signIn, signOut, getUser } from '../controllers/auth.controllers.js';
const authRouter = Router();

authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);
authRouter.post('/sign-out', signOut);
authRouter.get('/:id', getUser);

export default authRouter;
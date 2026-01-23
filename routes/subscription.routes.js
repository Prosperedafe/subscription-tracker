import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions } from '../controllers/subscription.controllers.js';

const subscriptionRouter = Router();

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;
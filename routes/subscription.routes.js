import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, getSubscriptionList } from '../controllers/subscription.controllers.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/list', getSubscriptionList);

subscriptionRouter.post('/', authorize, createSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;
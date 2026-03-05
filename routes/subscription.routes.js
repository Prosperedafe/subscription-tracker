import { Router } from 'express';
import authorize from '../middlewares/auth.middleware.js';
import { createSubscription, getUserSubscriptions, getSubscriptionList, getUserSubscriptionById, deleteSubscription } from '../controllers/subscription.controllers.js';

const subscriptionRouter = Router();

subscriptionRouter.get('/list', authorize, getSubscriptionList);

subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.get('/:id', authorize, getUserSubscriptionById);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;
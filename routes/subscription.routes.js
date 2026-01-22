import { Router } from 'express';

const subscriptionRouter = Router();

subscriptionRouter.get('/', (req, res) => {
  res.send({
    title: 'Subscriptions',
    message: 'Subscriptions fetched successfully',
    data: []
  });
});

subscriptionRouter.get('/:id', (req, res) => {
  res.send({
    title: 'Subscription',
    message: 'Subscription fetched successfully',
    data: {}
  });
});

export default subscriptionRouter;
import { Router } from 'express';
import { sendReminders } from '../controllers/workflow.controllers.js';
import { testQStashConnection, handleTestWebhook } from '../controllers/qstash-test.controllers.js';

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders)
workflowRouter.get('/test-connection', testQStashConnection)
workflowRouter.post('/test', handleTestWebhook)

export default workflowRouter;
import express from 'express';
import { PORT } from './config/env.js';

import userRouter from './routes/user.routes.js';
import authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectDB from './database/mongodb.js';
import errorMiddleware from './middlewares/error.middleware.js';
import cookieParser from 'cookie-parser';
import arcjetMiddleware from './middlewares/arcjet.middleware.js';
import workflowRouter from './routes/workflow.routes.js';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(arcjetMiddleware);
app.use(errorMiddleware);
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/workflows', workflowRouter);

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => { });
    } catch (error) {
        process.exit(1);
    }
};

startServer();

export default app;

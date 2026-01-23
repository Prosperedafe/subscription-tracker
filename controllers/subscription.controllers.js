import { SERVER_URL, NODE_ENV } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        try {
            await workflowClient.trigger({
                url: `${SERVER_URL}/api/workflows/subscription/reminder`,
                body: {
                    subscriptionId: subscription.id
                }
            });
        } catch (workflowError) {
            const isConnectionRefused = workflowError.cause?.code === 'ECONNREFUSED';
            if (isConnectionRefused) {
            }
        }
        res.status(201).json({
            success: true,
            message: "Subscription created successfully",
            data: subscription
        })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) {
            const error = new Error("You are not the owner of this account");
            error.statusCode = 401;
            throw error;
        }
        const subscriptions = await Subscription.find({ user: req.user.id });
        res.status(200).json({
            success: true,
            message: "Subscriptions fetched successfully",
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}

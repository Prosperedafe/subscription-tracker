import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";
import SubscriptionList from "../models/subscription-list.model.js";

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

export const getUserSubscriptionById = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);
        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }
        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("You are not the owner of this subscription");
            error.statusCode = 401;
            throw error;
        }
        res.status(200).json({
            success: true,
            message: "Subscription fetched successfully",
            data: subscription
        })
    } catch (error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.findById(req.params.id);

        if (!subscription) {
            const error = new Error("Subscription not found");
            error.statusCode = 404;
            throw error;
        }

        if (subscription.user.toString() !== req.user.id) {
            const error = new Error("You are not the owner of this subscription");
            error.statusCode = 401;
            throw error;
        }

        await Subscription.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Subscription deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}

export const getSubscriptionList = async (req, res, next) => {
    try {
        const subscriptions = await SubscriptionList.find();
        res.status(200).json({
            success: true,
            message: "Subscription list fetched successfully",
            data: subscriptions
        })
    } catch (error) {
        next(error);
    }
}

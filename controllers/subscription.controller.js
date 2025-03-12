import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const CreateSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id,
        });

        const {workflowRunId} = await workflowClient.trigger({
            url: '${SERVER_URL}/api/v1/workflows/subscription/reminder',
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'content-type': 'application/json',
            },
        });

        res.status(201).json({
            success: true,
            data: subscription,
        })
    } catch (error) {
        next(error);
    }
}

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id != req.params.id)
        {
            const error = new Error('Not the owner of this account');
            error.statusCode = 401;
            throw error;
        }
        const subscription = await Subscription.find({user: req.params.id});
        res.status(200).json ({
            success: true,
            data: subscription,
        })
    } catch (error) {
        next(error);
    }
}
import { Router } from "express"
import authorize from "../middlewares/auth.middleware.js"
import { CreateSubscription, getUserSubscriptions, getAllSubscriptions, getSubscriptionDetails, updateSubscription, deleteSubscription, cancelSubscription, getUpcomingRenewals } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, CreateSubscription)

subscriptionRouter.put('/', authorize, updateSubscription);

subscriptionRouter.delete('/:id', authorize, deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', authorize, cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', authorize, getUpcomingRenewals);

export default subscriptionRouter;
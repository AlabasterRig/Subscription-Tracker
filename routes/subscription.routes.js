import { Router } from "express"
import authorize from "../middlewares/auth.middleware.js"
import { CreateSubscription, getUserSubscriptions, getAllSubscriptions, getSubscriptionDetails, updateSubscription, deleteSubscription, cancelSubscription, getUpcomingRenewals } from "../controllers/subscription.controller.js";

const subscriptionRouter = Router()

subscriptionRouter.get('/', getAllSubscriptions);

subscriptionRouter.get('/:id', authorize, getSubscriptionDetails);

subscriptionRouter.post('/', authorize, CreateSubscription)

subscriptionRouter.put('/', updateSubscription);

subscriptionRouter.delete('/:id', deleteSubscription);

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

subscriptionRouter.put('/:id/cancel', cancelSubscription);

subscriptionRouter.get('/upcoming-renewals', getUpcomingRenewals);

export default subscriptionRouter;
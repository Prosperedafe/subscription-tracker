import mongoose from 'mongoose';

const subscriptionListSchema = new mongoose.Schema({}, { 
    strict: false, 
    collection: 'subscription-list' 
});

const SubscriptionList = mongoose.model('SubscriptionList', subscriptionListSchema);

export default SubscriptionList;

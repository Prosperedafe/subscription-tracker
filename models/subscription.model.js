import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subscription name is required'],
        trim: true,
        minlength: [2, 'Subscription name must be at least 3 characters long'],
        maxlength: [100, 'Subscription name must be less than 50 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Subscription price is required'],
        min: [0, 'Subscription price must be greater than 0']
    },
    currency: {
        type: String,
        enum: ['USD', 'EUR', 'GBP'],
        default: 'USD'
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly'],
    },
    category: {
        type: String,
        enum: ['food', 'entertainment', 'health', 'education', 'other'],
        required: [true, 'Subscription category is required']
    },
    paymentMethod: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'expired'],
        default: 'active'
    },
    startDate: {
        type: Date,
        required: true,
        validate: (value) => value <= new Date(),
        message: 'Start date must be in the future and before the end date'
    },
    renewalDate: {
        type: Date,
        required: true,
        validate: function (value) {
            return value > this.startDate
        },
        message: 'End date must be in the future'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    }
}, { timestamps: true });

subscriptionSchema.pre('save', async function () {
    if (!this.renewalDate && this.frequency && this.startDate) {
        const renewalPeriods = {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        const daysToAdd = renewalPeriods[this.frequency];
        if (daysToAdd) {
            this.renewalDate = new Date(this.startDate);
            this.renewalDate.setDate(this.renewalDate.getDate() + daysToAdd);
        }
    }

    if (this.renewalDate && this.renewalDate < new Date()) {
        this.status = 'expired';
    }
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

export default Subscription;
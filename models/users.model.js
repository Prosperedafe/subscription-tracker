import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User name is required'],
        trim: true,
        minlength: [3, 'User name must be at least 3 characters long'],
        maxlength: [20, 'User name must be less than 20 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: 'Email must be a valid email address'
        },
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        select: false
    },
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

export default User;
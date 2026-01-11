import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 4,
        /* unique: true */
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    rol: {
        type: String,
        required: true,
        enum: ['admin', 'manager', 'user']
    }
});

export default mongoose.model('User', userSchema);
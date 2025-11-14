import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxLength: 20
    },
    name:{
        type: String,
        required: true,
        minlength: 3,
        maxLength: 50
    },
    country: {
        type: String,
        required: true,
        match: /^[A-Z]{2}$/,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: [
            'base',
            'escolta',
            'alero',
            'ala-pivot',
            'pivot',
            'polivalente'
        ],
    },
});

const Player = mongoose.model('Player', playerSchema);

export default Player;

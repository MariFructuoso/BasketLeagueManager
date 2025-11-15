import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
    nickname:{
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxLength: 20,
        trim: true,
    },
    name:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxLength: 50

    },
    country: {
        type: String,
        required: true,
        trim: true,
        match: /^[A-Z]{2}$/,
    },
    birthDate: {
        type: Date,
        required: true,
    },
    role: {
        type: String,
        required: true,
        trim: true,
        enum: [
            'Base',
            'Escolta',
            'Alero',
            'Ala-pivot',
            'Pivot',
            'Polivalente'
        ],
    },
});

const Player = mongoose.model('Player', playerSchema);

export default Player;

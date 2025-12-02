import mongoose from "mongoose";

const allowedRoles = [
  "base",
  "escolta",
  "alero",
  "ala-pivot",
  "pivot",
  "polivalente"
];

let playerSchema = new mongoose.Schema({
    nickname: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 20,
        trim: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim: true
    },
    country: {
        type: String,
        required: true,
        match: /^[A-Z]{2}$/,
        trim: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    role: {
        type: String,
        required: true,
        enum: allowedRoles,
        trim: true
    }
});

let Player = mongoose.model("player", playerSchema);
export default Player;

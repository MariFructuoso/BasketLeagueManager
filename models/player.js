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
        required: [true, 'El nickname es obligatorio'],
        unique: true,
        minlength: [3, 'El nickname debe tener al menos 3 caracteres'],
        maxlength: [20, 'El nickname debe de tener menos de 20 caracteres'],
        trim: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        minlength: [3, 'El nombre es demasiado corto (min 3)'],
        maxlength: [50, 'El nickname debe de tener menos de 50 caracteres'],
        trim: true
    },
    country: {
        type: String,
        required: [true, 'El país es obligatorio'],
        match: [/^[A-Z]{2}$/, 'Formato: dos letras mayusculas (ej: ES)'],
        trim: true
    },
    birthDate: {
        type: Date,
        required: [true, 'La fecha de nacimiento es obligatoria']
    },
    role: {
        type: String,
        required: [true, 'El rol es obligatorio'],
        enum: allowedRoles,
        trim: true
    },
    image: {
        type: String,
        required: false
    }
});

let Player = mongoose.model("player", playerSchema);
export default Player;

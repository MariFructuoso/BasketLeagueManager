import mongoose from "mongoose";

let teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"] ,
        unique: true,
        minlength: [3, 'El nickname debe tener al menos 3 caracteres'],
        maxlength: [50, 'El nickname debe de tener menos de 20 caracteres'],
        trim: true
    },
    foundedAt: {
        type: Date
    },
    roster: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "player",
            required: true
        },
        joinDate: {
            type: Date,
            required: [true, 'La fecha de alta es obligatoria']
        },
        active: {
            type: Boolean,
            default: true
        }    
    }]
});

let Team = mongoose.model("team", teamSchema);
export default Team;

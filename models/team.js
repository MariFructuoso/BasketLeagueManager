import mongoose from "mongoose";

let teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50,
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
            required: true
        },
        active: {
            type: Boolean,
            default: true
        }    
    }]
});

let Team = mongoose.model("team", teamSchema);
export default Team;

import mongoose from "mongoose";

const rosterSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player',
        required: true,
    },
    joinDate: {
        type: Date,
        required: true,
    },
    active: {
        type: Boolean,
        default: true,
    },
});

const teamSchema = new mongoose.Schema({
    name:{
        type: String,
        trim: true,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    },
    foundedAt:{
        type: Date,
    },
        roster: [rosterSchema]
});

const Team = mongoose.model('Team', teamSchema);
export default Team;
import mongoose from "mongoose";

const allowedSeasons = [
    "Spring",
    "Summer",
    "Autumn",
    "Winter"
];

let tournamentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
        trim: true
    },
    year: {
        type: Number,
        required: true,
        min: 1900,
        max: 2100
    },
    season: {
        type: String,
        required: true,
        enum: allowedSeasons,
        trim: true
    },
    organizer: {
        type: String,
        minlength: 3,
        maxlength: 70,
        trim: true
    },
    teams: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    }]
});

tournamentSchema.index({ title: 1, year: 1, season: 1 }, { unique: true });

let Tournament = mongoose.model("tournament", tournamentSchema);
export default Tournament;

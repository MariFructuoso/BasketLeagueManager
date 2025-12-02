import mongoose from "mongoose";

const allowedStages = [
    "Group",
    "Quarterfinal",
    "Semifinal",
    "Final"
];

let matchScheme = new mongoose.Schema({
    tournament: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    date : {
        type: Date,
        required: true
    },
    stage: {
        type: String,
        required: true,
        enum: allowedStages,
        trim: true
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "team"
    },
    homeScore: {
        type: Number,
        required: true,
        min: 0
    },
    awayScore: {
        type: Number,
        required: true,
        min: 0},
    playerStats: [{
        player: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "player"
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "team"
        },
        points: {
            type: Number
        },
        rebounds: {
            type: Number
        },
        assists: {
            type: Number
        },
        steals: {
            type: Number
        },
        fouls: {
            type: Number
        },
        mvp: {
            type: Boolean
        },
    }]
});

matchScheme.index({ tournament: 1, date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });

let Match = mongoose.model("match", matchScheme);
export default Match;

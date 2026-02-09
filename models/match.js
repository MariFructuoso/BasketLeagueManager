import mongoose from "mongoose";

const allowedStages = [
    "Group",
    "Quarterfinal",
    "Semifinal",
    "Final"
];

let matchScheme = new mongoose.Schema({
    date : {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    stage: {
        type: String,
        required: [true, 'La fase del torneo es obligatoria'],
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
        required: [true, 'La puntuación local es obligatoria'],
        min: 0
    },
    awayScore: {
        type: Number,
        required: [true, 'La puntuación visitante es obligatoria'],
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

matchScheme.index({ date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });

let Match = mongoose.model("match", matchScheme);
export default Match;

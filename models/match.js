import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    Tournament: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tournament',
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    stage: {
        type: String,
        trim: true,
        required: true,
        enum: ['Group', 'Quarterfinal', 'Semifinal', 'Final'],
    },
    homeTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
    },
    awayTeam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team',
        required: true,
        //validar que sea diferente del homeTeam
    },
    homeScore: {
        type: Number,
        required: true,
        min: 0,
    },
    awayScore: {
        type: Number,
        required: true,
        min: 0,
    },
    PlayersStats: {
        type: [playerStatsSchema]
    }
    
});
matchSchema.index({ tournament: 1, date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });


let playerStatsSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Player'
    },
    team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team'
    },
    points: {
        type: Number,
        min: [0, 'Mínimo 0']
    },
    rebounds: {
        type: Number,
        min: [0, 'Mínimo 0']
    },
    assists: {
        type: Number,
        min: [0, 'Mínimo 0']
    },
    steals: {
        type: Number,
        min: [0, 'Mínimo 0']
    },
    fouls: {
        type: Number,
        min: [0, 'Mínimo 0']
    },
    mvp: {
        type: Boolean,
        default: false
    }
});


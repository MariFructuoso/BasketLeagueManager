import mongoose from "mongoose";

const playerStatsSchema = new mongoose.Schema({
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
        min: 0
    },
    rebounds: {
        type: Number,
        min: 0
    },
    assists: {
        type: Number,
        min: 0
    },
    steals: {
        type: Number,
        min: 0
    },
    fouls: {
        type: Number,
        min: 0
    },
    mvp: {
        type: Boolean,
        default: false
    }
});
const matchSchema = new mongoose.Schema({
    tournament: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    date: {
        type: Date,
        required: true,
    },
    stage: {
        type: String,
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
        validate: {
            validator: function(v) {
                return v.toString() !== this.homeTeam.toString();
            },
            message: 'awayTeam debe ser diferente de homeTeam'
        }
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
    playerStats: [playerStatsSchema]  
});

matchSchema.index({ tournament: 1, date: 1, homeTeam: 1, awayTeam: 1 }, { unique: true });

const Match = mongoose.model('Match', matchSchema);

export default Match;
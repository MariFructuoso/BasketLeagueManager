import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxLength: 100
    },
    year:{
        type: Number,
        required: true,
        min: 1900,
        max: 2100
    },
    season:{
        type: String,
        required: true,
        trim: true,
        enum: ['Spring', 'Summer', 'Autumn', 'Winter'],
    },
    organizer:{
        //nombre del organizador
        type: String,
        minlength: 3,
        maxLength: 70
    },
    teams:{
        //listado de los ID de los equipos inscritos
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Team'
    }
});

// Índice compuesto único para evitar duplicados en torneo + año + temporada
tournamentSchema.index({ title: 1, year: 1, season: 1 }, { unique: true });

const Tournament = mongoose.model('Tournament', tournamentSchema);

export default Tournament;
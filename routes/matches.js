import express from "express";
import Match from "../models/match.js";
import Team from "../models/team.js";
import { protegerRuta } from '../auth/auth.js';

const router = express.Router();

//OBETENER PARTIDOS
router.get("/", async (req, res) => {
    try {
        const matches = await Match.find()
            .populate("homeTeam", "name")
            .populate("awayTeam", "name");

        res.render('matches_list',{matches:matches});

    } catch (error) {
        res.status(500).render('error',{error:"Error interno al cargar partidos"})
    }
});

//FORMULARIO CREAR PARTIDO
router.get('/new', protegerRuta('admin'), async(req,res) => {
    try {
        const teams = await Team.find();
        res.render('match_add', { teams: teams });
    } catch (error) {
        res.render('error', { error: "Error al cargar formulario" });
    }
});

//CREAR PARTIDO
router.post('/', protegerRuta('admin'), async (req, res) => {
    try {
        const newMatch = new Match({
            date: req.body.date,
            stage: req.body.stage,
            homeTeam: req.body.homeTeam || null, //si es vacio "" da error
            awayTeam: req.body.awayTeam || null,
            homeScore: req.body.homeScore || 0,
            awayScore: req.body.awayScore || 0
        });

        await newMatch.save();
        res.redirect("/matches");

    } catch (error) {
        const teams = await Team.find(); 
        
        let errores = {};

        if (error.errors) {
            if (error.errors.date) errores.date = error.errors.date.message;
            if (error.errors.stage) errores.stage = error.errors.stage.message;
            if (error.errors.homeScore) errores.homeScore = error.errors.homeScore.message;
            if (error.errors.awayScore) errores.awayScore = error.errors.awayScore.message;
        } else {
            errores.general = "Error general al guardar el partido";
        }

        res.render('match_add', { 
            errores: errores, 
            match: req.body,
            teams: teams
        });
    }
});

//Eliminar un partido
router.delete('/:id', protegerRuta('manager'), async (req, res) => {
    try {
        const id = req.params.id;

        const deletedMatch = await Match.findByIdAndDelete(id);

        if (!deletedMatch) {
            return res.status(404).json({ error: "Partido no encontrado.", result: null });
        }

        res.status(200).json({ error: null, result: deletedMatch });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor.", result: null });
    }
});

//DETALLES 
router.get("/:id", async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate("homeTeam")
            .populate("awayTeam")
            .populate("playerStats.player")
            .populate("playerStats.team");

        if (!match) {
            return res.render('error', {error: ""});
        }

        res.render('match_details',{match: match});

    } catch (error) {
        ('error', {error: "error interno"})
    }
    
});

export default router;
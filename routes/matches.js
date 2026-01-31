import express from "express";
import Match from "../models/match.js";
import { protegerRuta } from '../auth/auth.js';

const router = express.Router();

//Listar todos los partidos
router.get("/", protegerRuta(), async (req, res) => {
    try {
        const matches = await Match.find()
            .populate("homeTeam", "name")
            .populate("awayTeam", "name");

        if (matches.length === 0) {
            return res.status(404).json({ error: "No hay partidos", result: null });
        }

        res.status(200).json({ error: null, result: matches });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

//Información de un partido
router.get("/:id", protegerRuta(), async (req, res) => {
    try {
        const match = await Match.findById(req.params.id)
            .populate("homeTeam")
            .populate("awayTeam")
            .populate("playerStats.player")
            .populate("playerStats.team");

        if (!match) {
            return res.status(404).json({ 
                error: "Partido no encontrado", 
                result: null 
            });
        }

        res.status(200).json({ 
            error: null, 
            result: match 
        });

    } catch (error) {
        res.status(500).json({ 
            error: "Error interno", 
            result: null 
        });
    }
});

//Añadir un partido 
router.post('/', protegerRuta('manager'), async (req, res) => {
    try {
        const { tournament, date, stage, homeTeam, awayTeam, homeScore, awayScore } = req.body;

        if (!tournament || !date || !stage || !homeTeam || !awayTeam || homeScore === undefined || awayScore === undefined) {
            return res.status(400).json({ error: "Faltan campos obligatorios", result: null });
        }

        if (homeTeam === awayTeam) {
            return res.status(400).json({ error: "El equipo local y visitante no pueden ser el mismo", result: null });
        }

        const newMatch = await Match.create({
            tournament,
            date: new Date(date),
            stage,
            homeTeam,
            awayTeam,
            homeScore,
            awayScore
        });


        const populatedMatch = await Match.findById(newMatch._id)
            .populate('homeTeam')
            .populate('awayTeam');

        res.status(201).json({ error: null, result: populatedMatch });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
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

export default router;
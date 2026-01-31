import express from 'express';  
import Team from '../models/team.js';
import Player from '../models/player.js';
import Match from '../models/match.js';
import { protegerRuta } from '../auth/auth.js';

const router = express.Router();

//Lista de todos los equipos
router.get('/', protegerRuta(), async (req, res)=> {
    try{
        const teams = await Team.find();

        if(teams.length ===0)
        {
            return res.status(404).json({
                error: "No existen equipos",
                result: null
            })
        }

        res.status(200).json({
            error: null,
            result: teams
        });
    } catch(error){
        res.status(500).json({
            error: "Error del sistema",
            result: null
        })
    }
});

//Crear equipo
router.post('/', protegerRuta('admin'), async (req, res) => {
    try {
        const { name } = req.body;

        if (!name) {
            return res.status(400).json({ error: "Falta el nombre del equipo", result: null });
        }

        const teamExist = await Team.findOne({ name: name });
        if (teamExist) {
            return res.status(400).json({ error: "Ya existe un equipo con ese nombre", result: null });
        }

        const newTeam = new Team(req.body);
        await newTeam.save();

        res.status(201).json({ error: null, result: newTeam });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

//Eliminar un equipo
router.delete('/:id', protegerRuta('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ error: "El equipo no existe", result: null });
        }

        const matchAssociated = await Match.findOne({
            $or: [
                { homeTeam: id },
                { awayTeam: id }
            ]
        });

        if (matchAssociated) {
            return res.status(400).json({ error: "No se puede eliminar el equipo porque tiene partidos asociados", result: null });
        }

        const deletedTeam = await Team.findByIdAndDelete(id);

        res.status(200).json({ error: null, result: deletedTeam });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

//Añadir un jugador al roster
router.post('/:id/roster', protegerRuta('manager'), async (req, res) => {
    try {
        const id  = req.params.id;
        const { player, joinDate, active } = req.body;

        const team = await Team.findById(id );
        if (!team) {
            return res.status(404).json({ error: "El equipo no existe", result: null });
        }

        const playerExist = await Player.findById(player);
        if (!playerExist) {
            return res.status(404).json({ error: "El jugador no existe", result: null });
        }

        const teamPlayer = await Team.findOne({
            "roster": {
                $elemMatch: { player: player, active: true }
            }
        });

        if (teamPlayer) {
            if (teamPlayer._id.equals(team._id)) {
                return res.status(400).json({ error: "Jugador activo en este equipo", result: null });
            } else {
                return res.status(400).json({ error: "Jugador activo en otro equipo", result: null });
            }
        }

        team.roster.push({ player, joinDate, active });
        await team.save();

        const updatedTeam = await Team.findById(id).populate('roster.player');
        
        const teamData = updatedTeam.toObject();
        teamData.roster = teamData.roster.filter(d => d.active === true);

        res.status(200).json({ error: null, result: teamData });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});
 
//Dar de baja un jugador del roster
router.delete('/:id/roster/:playerId', protegerRuta('manager'), async (req, res) => {
    try {
        const { id, playerId } = req.params;

        const team = await Team.findById(id);
        if (!team) {
            return res.status(404).json({ error: "Equipo no encontrado.", result: null });
        }

        const rosterAct = team.roster.find(e => 
            e.player.toString() === playerId && e.active === true
        );

        if (!rosterAct) {
            return res.status(404).json({ error: "El jugador no está activo en el roster de este equipo", result: null });
        }

        rosterAct.active = false;

        await team.save();

        const updatedTeam = await Team.findById(id).populate('roster.player');
        
        const teamData = updatedTeam.toObject();
        teamData.roster = teamData.roster.filter(entry => entry.active === true);

        res.status(200).json({ error: null, result: teamData });

    } catch (error) {
        res.status(500).json({ error: "Error interno del servidor.", result: null });
    }
});

//Busca un equipo por ID y muestra toda la información
router.get('/:id', protegerRuta(), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('roster.player');

        if (!team) {
            return res.status(404).json({ error: "No existe ese equipo", result: null });
        }

        const teamData = team.toObject(); //??
        teamData.roster = teamData.roster.filter(d => d.active === true);
        res.status(200).json({ error: null, result: teamData });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});


export default router;
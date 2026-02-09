import express from 'express';
import Team from '../models/team.js';
import Player from '../models/player.js';
import Match from '../models/match.js';
import { protegerRuta } from '../auth/auth.js';

const router = express.Router();

//OBTENER EQUIPOS
router.get('/', protegerRuta(), async (req, res) => {
    try {
        const resultado = await Team.find();
        res.render('teams_list', { teams: resultado });

    } catch (error) {
        res.status(500).render(error, { error: "Error del sistema" })
    }
});

//FORMULARIO DE CREAR EQUIPO
router.get("/new", protegerRuta('admin'), async (req,res) => {
    const jugadores = await Player.find()
    res.render('team_add', { players: jugadores})
});

// CREAR EQUIPO
router.post('/', protegerRuta('admin'), async (req, res) => {
    try {
        const { name, foundedAt } = req.body;

        const teamExist = await Team.findOne({ name: name });
        if (teamExist) {
            const players = await Player.find();
            return res.render('team_add', {
                error: "Ese nombre de equipo ya existe",
            });
        }

        const newTeam = new Team({
            name: name,
            foundedAt: foundedAt,
        });

        await newTeam.save();
        res.redirect("/teams");

    } catch (error) {
        let errores = {};

        if(error.errors)
        {
            if (error.errors.name) errores.name = error.errors.name.message;
            if (error.errors.foundedAt) errores.foundedAt = error.errors.foundedAt.message;
        } else {
            errores.general = "Error general al crear el equipo";
        }
        res.render('team_add', { 
            errores: errores, 
            team: req.body 
        });
    }
});

//ELIMINAR EQUIPO
router.delete('/:id', protegerRuta('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findById(id);
        if (!team) {
            return res.render('error', { error: "El equipo no existe" });
        }
        const matchAssociated = await Match.findOne({
            $or: [
                { homeTeam: id },
                { awayTeam: id }
            ]
        });

        if (matchAssociated) {
            return res.render('error', { error: "No se puede eliminar el equipo porque tiene partidos asociados" });
        }

        await Team.findByIdAndDelete(id);

        res.redirect('/teams');

    } catch (error) {
        res.render('error', { error: "Error interno" });
    }
});

//FORMULARIO PARA AÑADIR JUGADOR
router.get('/:id/roster/new', protegerRuta('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const team = await Team.findById(id);
        const players = await Player.find();

        res.render('team_add_player', { 
            team: team,
            players: players
        });

    } catch (error) {
        res.render('error', { error: "Error al cargar el formulario" });
    }
});

//AÑADIR JUGADOR
router.post('/:id/roster', protegerRuta('admin'), async (req, res) => {
    try {
        const { id } = req.params; 
        const { player, joinDate } = req.body; 

        const jugadorOcupado = await Team.findOne({
            "roster": {
                $elemMatch: {
                    player: player,
                    active: true
                }
            }
        });

        if (jugadorOcupado) {
            const team = await Team.findById(id);
            const players = await Player.find();
            
            let mensajeError = "Este jugador ya pertenece a otro equipo activo";
            if (jugadorOcupado.id === id) {
                mensajeError = "Este jugador ya está en este equipo";
            }
            return res.render('team_add_player', {
                error: mensajeError,
                team: team,
                players: players
            });
        }

        const team = await Team.findById(id);
        
        team.roster.push({
            player: player,
            joinDate: joinDate,
            active: true
        });

        await team.save();
        res.redirect(`/teams/${id}`);

    } catch (error) {
        try {
            const team = await Team.findById(req.params.id);
            const players = await Player.find();
            res.render('team_add_player', { 
                error: "Error interno al añadir el jugador",
                team: team,
                players: players
            });
        } catch (e) {
            res.render('error', { error: "Error interno" });
        }
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
//ELIMINAR EQUIPO
router.delete('/:id', protegerRuta('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        const team = await Team.findById(id);
        if (!team) {
            return res.render('error', { error: "El equipo no existe" });
        }
        const matchAssociated = await Match.findOne({
            $or: [
                { homeTeam: id },
                { awayTeam: id }
            ]
        });

        if (matchAssociated) {
            return res.render('error', { error: "No se puede eliminar el equipo porque tiene partidos asociados" });
        }

        await Team.findByIdAndDelete(id);

        res.redirect('/teams');

    } catch (error) {
        res.render('error', { error: "Error interno" });
    }
});
//DETALLES DE UN EQUIPO
router.get('/:id', protegerRuta(), async (req, res) => {
    try {
        const team = await Team.findById(req.params.id).populate('roster.player');

        if (!team) {
            return res.status(404).render('error', { error: "No existe ese equipo" });
        }

        team.roster = team.roster.filter(player => player.active === true);

        res.render('team_details', { team: team });


    } catch (error) {
        res.status(500).render(error, { error: "Error interno" });
    }
});


export default router;
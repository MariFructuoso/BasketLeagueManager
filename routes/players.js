import express from "express";
import Player from "../models/player.js";
import Team from "../models/team.js";
import { protegerRuta } from '../auth/auth.js';

const router = express.Router();

//OBTENER JUGADORES
router.get("/", protegerRuta(), async (req, res) => {
    try {
        const result = await Player.find();
        res.render('players_list', { players: result });
        
    } catch (error) {
        res.status(500).render('error', { error: "Error interno al listar jugadores" });
    }
});

//Buscar por nombre
router.get("/find", protegerRuta(), async (req, res) => {
    try {
        const nameQuery = req.query.name;

        if (!nameQuery) {
            return res
                .status(400)
                .json({ error: "Fallo en la petición", result: null });
        }
        const players = await Player.find({
            name: { $regex: nameQuery, $options: "i" },
        });

        if (players.length === 0) {
            return res.status(404).json({ error: "No existen jugadores con ese nombre", result: null });
        }

        res.status(200).json({ error: null, result: players });
    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

// Crear un nuevo jugador
router.post("/", protegerRuta('admin'), async (req, res) => {
    try {
        const { nickname, name, country, birthDate, role } = req.body;

        if (!nickname || !name || !country || !birthDate || !role) {
            return res.status(400).json({ error: "Datos incorrectos: faltan campos obligatorios", result: null });
        }

        const playerExist = await Player.findOne({ nickname: nickname });
        if (playerExist) {
            return res.status(400).json({ error: "El jugador ya existe", result: null });
        }

        const newPlayer = new Player({
            nickname,
            name,
            country,
            birthDate: new Date(birthDate),
            role,
        });

        const savedPlayer = await newPlayer.save();

        res.status(201).json({ error: null, result: savedPlayer });
    } catch (error) {
        if (error.name === "ValidationError") {
            return res
                .status(400)
                .json({ error: "Datos incorrectos: " + error.message, result: null });
        }
        res.status(500).json({ error: "Error interno del servidor", result: null });
    }
});

// Eliminar un jugador
router.delete("/:id", protegerRuta('admin'), async (req, res) => {
    try {
        const playerId = req.params.id;

        const teamWithPlayer = await Team.findOne({
            roster: {
                $elemMatch: {
                    player: playerId,
                    active: true,
                },
            },
        });

        if (teamWithPlayer) {
            return res.render('error', {error: "Jugador en equipo activo, no se puede borrar"});
        }

        await Player.findByIdAndDelete(playerId);

        res.redirect('/players'); //???????????? /players

    }catch (error){
        res.status(500).render('error', {error:"Error interno al eliminar el jugador"});
    }
});



//EDITAR JUGADOR
//Muestra el formulario con los datos del jugador
router.get('/:id/editar', protegerRuta('admin'), async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        
        if (player) {
            res.render('player_edit', { player: player });
        } else {
            res.render('error', { error: "Jugador no encontrado" });
        }
    } catch (error) {
        res.render('error', { error: "Error al buscar el jugador" });
    }
});

//Recibe los datos del formulario cuando pulsas guardar
router.post('/:id', protegerRuta('admin'), async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);

        if (!player) {
            return res.render('error', { error: "Jugador no encontrado" });
        }

        if (req.body.nickname !== player.nickname) {
             const nickOcupado = await Player.findOne({ nickname: req.body.nickname });
             if (nickOcupado) {
                 let errores = { nickname: "Ese Nickname ya está en uso" };
                 return res.render('player_edit', { 
                    errores: errores,
                    player: { ...req.body, id: req.params.id }
                 });
             }
        }

        player.nickname = req.body.nickname;
        player.name = req.body.name;
        player.country = req.body.country;
        player.birthDate = req.body.birthDate;
        player.role = req.body.role;

        await player.save();

        res.redirect('/players'); //?????????????????????????

    } catch (error) {
        let errores = {};

        if (error.errors) {
            if (error.errors.nickname) errores.nickname = error.errors.nickname.message;
            if (error.errors.name) errores.name = error.errors.name.message;
            if (error.errors.country) errores.country = error.errors.country.message;
            if (error.errors.birthDate) errores.birthDate = error.errors.birthDate.message;
            if (error.errors.role) errores.role = error.errors.role.message;
        } else {
            errores.general = "Error general al guardar";
        }
        res.render('player_edit', { 
            errores: errores, 
            player: { ...req.body, id: req.params.id } 
        });
    }
});

//VER DETALLES DE UN JUGADOR
router.get("/:id", protegerRuta(), async (req, res) => {
    try {
        const resultado = await Player.findById(req.params.id);
        if (!resultado) {
            
            return res.render('error', {error: "Jugador no encontrado"});
        }
        res.render('player_details', { player: resultado});
    } catch (error) {
        res.status(500).render('error', { error: "Error interno al buscar el jugador"});
    }
});

export default router;

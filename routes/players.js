import express from 'express';
import Player from '../models/player.js';
import Team from '../models/team.js'; 

const router = express.Router();

// Obtener todos los jugadores
 router.get('/', async (req, res) => {
    try {
        const players = await Player.find();
        
        if (players.length === 0) {
            return res.status(404).json({
                error: "No existen jugadores registrados",
                result: null
            });
        }

        res.status(200).json({ error: null, result: players });
    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
 });

//Buscar por nombre
router.get('/find', async (req, res) => {
    try {
        const nameQuery = req.query.name;

        if (!nameQuery) {
            return res.status(400).json({
                error: "Fallo en la petición",
                result: null
            });
        }
        const players = await Player.find({
            name: { $regex: nameQuery, $options: 'i' }
        });

        if (players.length === 0) {
            return res.status(404).json({
                error: "No existen jugadores con ese nombre",
                result: null
            });
        }

        res.status(200).json({ error: null, result: players });

    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

// Crear un nuevo jugador
router.post('/', async (req, res) => {
    try {
        const { nickname, name, country, birthDate, role } = req.body;

        if (!nickname || !name || !country || !birthDate || !role) {
            return res.status(400).json({
                error: "Datos incorrectos: faltan campos obligatorios",
                result: null
            });
        }

        const playerExist = await Player.findOne({ nickname: nickname });
        if (playerExist) {
            return res.status(400).json({
                error: "El jugador ya existe",
                result: null
            });
        }

        const newPlayer = new Player(req.body);
        const savedPlayer = await newPlayer.save();
        
        res.status(201).json({
            error: null,
            result: savedPlayer
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
             return res.status(400).json({ error: "Datos incorrectos: " + error.message, result: null });
        }
        res.status(500).json({ error: "Error interno del servidor", result: null });
    }
});

// Actualizar un jugador 
router.put('/:id', async (req, res) => {
    try {
        const playerId = req.params.id;
        const nuevoDato = req.body;

        const playerAntiguo = await Player.findById(playerId);

        if (!playerAntiguo) {
            return res.status(404).json({
                error: "Jugador no encontrado",
                result: null
            });
        }

        if (nuevoDato.nickname && nuevoDato.nickname !== playerAntiguo.nickname) {
            
            const nickOcupado = await Player.findOne({ nickname: nuevoDato.nickname });

            if (nickOcupado) {
                return res.status(400).json({
                    error: "Nickname ya en uso",
                    result: null
                });
            }
        }

        const playerActualizado = await Player.findByIdAndUpdate(playerId, nuevoDato, { 
            new: true, 
            runValidators: true 
        });

        res.status(200).json({
            error: null,
            result: playerActualizado
        });

    } catch (error) {
        if (error.name === 'ValidationError') {
             return res.status(400).json({ 
                 error: "Datos incorrectos: " + error.message, 
                 result: null 
             });
        }
        res.status(500).json({ error: "Error interno", result: null });
    }
});

// Eliminar un jugador
router.delete('/:id', async (req, res) => {
    try {
        const playerId = req.params.id;
        const player = await Player.findById(playerId);
        
        if (!player) {
            return res.status(404).json({
                error: "Jugador no encontrado",
                result: null
            });
        }

        const teamWithPlayer = await Team.findOne({
            roster: { 
                $elemMatch: { 
                    player: playerId, 
                    active: true 
                } 
            }
        });

        if (teamWithPlayer) {
            return res.status(400).json({
                error: "Jugador en equipo activo, no se puede borrar",
                result: null
            });
        }

        await Player.findByIdAndDelete(playerId);

        res.status(200).json({
            error: null,
            result: player 
        });

    } catch (error) {
        res.status(500).json({
            error: "Error interno",
            result: null
        });
    }
});

// Obtener un jugador por su ID
router.get('/:id', async (req, res) => {
    try {
        const player = await Player.findById(req.params.id);
        if (!player) {
            return res.status(404).json({
                error: "Jugador no encontrado",
                result: null
            });
        }
        res.status(200).json({ error: null, result: player });
    } catch (error) {
        res.status(500).json({ error: "Error interno", result: null });
    }
});

export default router;
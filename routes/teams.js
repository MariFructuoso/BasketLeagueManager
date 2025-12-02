import express from 'express';  
import Match from '../models/match.js';
import Team from '../models/team.js';
import Player from '../models/player.js';

const router = express.Router();

//Lista de todos los equipos
router.get('/', async (req, res)=> {
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


export default router;
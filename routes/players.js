import express from "express";
import Player from "../models/player.js";
import Team from "../models/team.js";
import { protegerRuta } from '../auth/auth.js';
import multer from "multer";

const router = express.Router();

router.use(protegerRuta());

// CONFIGURACION MULTER
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads'); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  }
});

const upload = multer({ storage: storage });

//OBTENER JUGADORES
router.get("/", async (req, res) => {
    try {
        const result = await Player.find();
        res.render('players_list', { players: result });
        
    } catch (error) {
        res.status(500).render('error', { error: "Error interno al listar jugadores" });
    }
});

//BUSCAR POR NOMBRE
router.get("/find", async (req, res) => {
    const name = req.query.name;
    try {
        const result = await Player.find({
            name: { $regex: name, $options: "i" },
        });

        if (result.length === 0) {
            return res.render('error', { error: "No hay jugadores con ese nombre"});
        }

        res.render('players_list', {players:result});
    } catch (error) {
        res.render('error', {error:"Error interno"})
    }
});

//FORM DE CREAR JUGADOR
router.get("/new", protegerRuta('admin'), async (req,res) => {
    res.render('player_add')
});
// CREAR NUEVO JUGADOR
router.post("/", protegerRuta('admin'), upload.single('image'), async (req, res) => {
    try {
        const { nickname, name, country, birthDate, role } = req.body;

        const playerExist = await Player.findOne({ nickname: nickname });
        if (playerExist) {
            let errores = {nickname: "Nickname en uso"};
            return res.render('player_add', {
                errores:errores,
                player:req.body
            });
        }

        const newPlayer = new Player({
            nickname,
            name,
            country,
            birthDate: new Date(birthDate),
            role,
            image: req.file ? req.file.filename : null
        });

        await newPlayer.save();
        res.redirect('/players');

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
        res.render('player_add', { 
            errores: errores, 
            player: req.body
        });
    }
});

//ELIMINAR
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

        res.redirect('/players'); 

    }catch (error){
        res.status(500).render('error', {error:"Error interno al eliminar el jugador"});
    }
});

//EDITAR JUGADOR
//Muestra el formulario con los datos del jugador
router.get('/:id/edit', protegerRuta('admin'), async (req, res) => {
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


router.post('/:id', protegerRuta('admin'), upload.single('image'), async (req, res) => {
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
        if (req.file) {
            player.image = req.file.filename;
        }

        await player.save();
        res.redirect('/players');

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
router.get("/:id", async (req, res) => {
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

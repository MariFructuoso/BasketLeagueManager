import express from 'express';
import User from '../models/users.js'; 
import { generarToken } from '../auth/auth.js'; 

const router = express.Router();

router.post('/login', (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    User.findOne({ login: login, password: password }).then(user => {
        if (user) {
            const token = generarToken(user);
            res.status(200).json({ error: null, result: token });
        } else {
            res.status(401).json({ error: "Login incorrecto", result: null });
        }
    }).catch(err => {
        res.status(500).json({ error: "Error del servidor", result: null });
    });
});

export default router;
import express from 'express';
import User from '../models/users.js'; 
import { generarToken } from '../auth/auth.js';

const router = express.Router();

//FORMULARIO LOGIN
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    let login = req.body.login;
    let password = req.body.password;

    try {
        const user = await User.findOne({ login: login, password: password });

        if (user) {
            const token = generarToken(user);
            res.cookie('token', token, { 
                httpOnly: true, 
                sameSite: 'lax'  
            });
            res.redirect('/players');
        } else {
            res.render('login', { error: "Usuario o contraseña incorrectos" });
        }
    } catch (err) {
        res.render('login', { error: "Error del servidor" });
    }
});

//CERRAR SESION
router.get('/logout', (req, res) => {
    res.clearCookie('token');
    res.redirect('/auth/login');
});

export default router;
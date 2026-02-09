import jwt from 'jsonwebtoken';
const secreto = "secretoNode"; 

export const generarToken = (usuario) => {
    const payload = { 
        login: usuario.login, 
        rol: usuario.rol 
    };
    return jwt.sign(payload, secreto, { expiresIn: "2h" });
};

export const protegerRuta = (rolRequerido) => {
    return (req, res, next) => {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.redirect('/auth/login');
        }
        try {
            const datos = jwt.verify(token, secreto);
            if (rolRequerido && datos.rol !== rolRequerido) {
                return res.render('error', { error: "No tienes permisos de administrador" });
                
            }
            req.user = datos;
            res.locals.session = datos; 
            next();
        } catch (error) {
            return res.redirect('/auth/login');
        }
    };
};
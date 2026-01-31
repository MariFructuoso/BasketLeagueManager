import jwt from 'jsonwebtoken';

const secreto = "secretoNode"; 

export const generarToken = (usuario) => {
    const datos = { 
        login: usuario.login, 
        rol: usuario.rol 
    };
    return jwt.sign(datos, secreto, { expiresIn: "2 hours" });
};

export const protegerRuta = (rolRequerido) => {
    return (req, res, next) => {
        let token = req.headers['authorization'];

        if (token && token.startsWith("Bearer ")) {
            token = token.slice(7);
        }

        if (token) {
            jwt.verify(token, secreto, (err, datos) => {
                if (err) {
                    return res.status(401).json({ error: "Token no válido", result: null });
                } else { //rol admin puede entrar en manager
                    if (rolRequerido && datos.rol !== rolRequerido && datos.rol !== 'admin') {
                        return res.status(403).json({ error: "Acceso no autorizado", result: null });
                    }                  
                    req.usuario = datos; 
                    next();
                }
            });
        } else {
            return res.status(401).json({ error: "Token no proporcionado", result: null });
        }
    };
};
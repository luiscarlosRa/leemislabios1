const jwt = require('jsonwebtoken');
const moment = require('moment');
const Usuario = require('../models/usuario')


const reqToken = async (req, res, next) => {
    const token = req.headers['authorization']
    // comprobamos si existe la cabecera
    if(!token) {
       res.send("error");
    }

    let obj = {}; 

    try {
         obj = jwt.verify(token, process.env.SECRETKEY) 
    }
    catch(error) {
        // si no es correcto la app peta por lo que lo encerramos en un catch
        console.log(error);
        return res.send({ error: 'Logueate en la plataforma para acceder al contenido de los cursos' })
    }

    console.log(obj)

    const fechaActual = moment().unix();

    if(fechaActual > obj.fechaExpiracion) { // comprobamos que el token no este caducado
        return res.send("La contraseña ha caducado");
    }

    req.user = await Usuario.findById(obj.usuarioId); // si todo está correcto igualamos

    next()
}


module.exports = reqToken;
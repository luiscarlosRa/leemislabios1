const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UsuarioSchema = new Schema({
    nombre: String,
    apellidos: String,
    email: String,
    password: String,
    idCompra : String, 
    digitos:String
});

module.exports = mongoose.model('usuario', UsuarioSchema);
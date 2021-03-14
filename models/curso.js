const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CursoSchema = new Schema({
    titulo: String,
    texto: String,
    leccion: Array,
    url: Array,
    subtitulo: Array,
    imagen: String,

});

module.exports = mongoose.model('curso', CursoSchema);
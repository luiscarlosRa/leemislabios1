var express = require('express');
var router = express.Router();
const Curso = require("../../models/curso");


router.post('/', (req, res) => {

    try {
        Curso.create(req.body);
        res.send('Curso creado');
    }

    catch(error) {
        res.send(error);
    }

});

router.get('/', async (req, res) => {

    try {
        const cursos = await Curso.find();
        res.json(cursos);
    }

    catch(error) {
        console.log(error);
        res.json({error:"No se encuentra ningún curso"});
    }

});

module.exports = router;
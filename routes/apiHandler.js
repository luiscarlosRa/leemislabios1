const router = require('express').Router();
const apiUsuarios = require('./api/users');
const apiCursos = require('./api/cursos');
const reqToken = require('./middleware');

router.use('/new', apiUsuarios);
router.use('/recarga', reqToken, apiUsuarios);
router.use('/cursos', reqToken, apiCursos);
router.use('/cursos-pres', apiCursos);
router.use('/login',  apiUsuarios);


module.exports = router;
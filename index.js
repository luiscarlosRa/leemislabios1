const express = require('express');
const conectarDB = require('./config/db');
const apiHandler = require('./routes/apiHandler');
const cors = require('cors');

const app = express();

conectarDB();

app.use(express.json({extended:true}));

app.use(cors());

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send("hola mundo");
});

app.use('/api', apiHandler);


app.listen(PORT, () => {
    console.log(`El servidor está funcionando en el puerto ${PORT}`);
})
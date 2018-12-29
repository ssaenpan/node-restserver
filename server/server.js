require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');

//app.use {Son MIDEWARES se disparan cada vez que pasa por aqui el codigo}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(require('./routes/index'));

//Configuración Global de Rutas
mongoose.connect(process.env.URLDB, {

    useNewUrlParser: true
}, (err, res) => {

    if (err) throw err;
    console.log('Base de datos ONLINE');
});

mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
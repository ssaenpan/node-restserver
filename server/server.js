require('./config/config');

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

//app.use {Son MIDEWARES se disparan cada vez que pasa por aqui el codigo}

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/usuario', function(req, res) {
    res.json('Get Usuario')
});

//Crear nuevos registros
app.post('/usuario', function(req, res) {

    let body = req.body;

    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensasaje: 'Es requerido en nombre'
        });
    } else {
        res.json({
            persona: body
        });
    }
});

//Actualizar datos
app.put('/usuario/:id', function(req, res) {

    let idUsuario = req.params.id;
    res.json({
        idUsuario
    });
})

app.delete('/usuario', function(req, res) {
    res.json('Delete Usuario')
})

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});
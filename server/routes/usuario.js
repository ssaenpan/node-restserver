const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const Usuario = require('../../models/usuario');
const { verificarToken, verificaAdmin_Role } = require('../middlewares/autenticacion');
const app = express();

app.get('/usuario', verificarToken, (req, res) => {
    //res.json('Get Usuario')



    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });
            });

        })
});

//Crear nuevos registros
app.post('/usuario', [verificarToken, verificaAdmin_Role], (req, res) => {

    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        //usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });


    // if (body.nombre === undefined) {
    //     res.status(400).json({
    //         ok: false,
    //         mensasaje: 'Es requerido en nombre'
    //     });
    // } else {
    //     res.json({
    //         persona: body
    //     });
    // }
});

//Actualizar datos
app.put('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {

    let idUsuario = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(idUsuario, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    })

});

app.delete('/usuario/:id', [verificarToken, verificaAdmin_Role], (req, res) => {
    //res.json('Delete Usuario')
    let idUsuario = req.params.id;

    let cambiaEstado = {
        estado: false
    };
    //Usuario.findByIdAndRemove(idUsuario, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(idUsuario, cambiaEstado, { new: true }, (err, usuarioBorrado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuarios no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;
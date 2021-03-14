var express = require('express');
var router = express.Router();
const { check, validationResult } = require('express-validator');
const Usuario = require("../../models/usuario");
const Stripe = require("stripe");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const nodemailer = require('nodemailer');


const stripe = new Stripe('sk_test_51IACPNA97eoLvTyByGD2b4Be420l5Zv28PqP3tJiQ97SwnTlkULQ52msFPX3b7mZFnDEXIYBWmIFyI3f6yvAtnM700UhBHmEDV');


router.post('/', [
check('nombre', 'El campo nombre es requerido').exists().notEmpty(),
check('apellidos', 'El campo apellidos es requerido').exists().notEmpty(),
check('apellidos', 'El campo email es requerido').exists().notEmpty(),
check('password', 'El campo password es requerido').exists().notEmpty(),
], (req, res) => {
  const errores = validationResult(req);
  req.body.password = bcrypt.hashSync(req.body.password);

  if(!errores.isEmpty()) {
      return res.json(errores);
  }

  Usuario.findOne({email:req.body.email})
  .then(usuario => {
    if(usuario != null) {
      console.log("El email que intentas registrar ya está en uso");
      return res.send({message:"El email que intentas registrar ya está en uso"})
      
    } else {
      Usuario.create(req.body)
      .then(nuevoCliente => {
        res.send('Cliente creado con éxito')
      })

      .catch(error => res.send({error: error.message}))
    }
  })
});

router.post('/checkout', async (req, res) => {
  try {
    const payment = await stripe.paymentIntents.create({
      amount:10000,
      currency: 'eur',
      description: 'suscripcion',
      payment_method:req.body.id,
      confirm: true
    });

  }

  catch(error) {
    console.log({message:'error en el proceso de pago'});
  }


  try {
    const userUpdate = await Usuario.findOneAndUpdate({email:req.body.email}, {idCompra: req.body.id}, { useFindAndModify: false }); 

    try {
      res.send({
        message:'Usuario creado correctamente',
        token: crearToken(userUpdate),
        usuario: userUpdate.nombre
      })
    }

    catch(error) {
      console.log(error);
    }

    
    sendEmail(userUpdate);

  }

  catch(error) {
    console.log(error);
  }

});

const sendEmail = async (userUpdate) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
      user: 'loseternosfavoritos07@gmail.com', 
      pass: 'ltjqoihxgxhlmqml', 
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'LEEMISLABIOS <foo@example.com>',
    to: "loseternosfavoritos07@gmail.com",
    subject: "✔ Bienvenido a LEEMISLABIOS.COM", 
    html: `<h1>Bienvenido ${userUpdate.nombre}</h1>
            <p>Estamos encantados de tenerte en nuestro equipo</p>
            <p>Hemos recibido tu solicitud de suscripción correctamente y ya puedes empezar tu entrenamiento</p>
    `, // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
}

const crearToken = (userUpdate) => {
  const obj = {
    usuario: userUpdate.email,
    fechaCreacion: moment().unix(),
    fechaExpiracion : moment().add(20, 'minutes').unix(),
  }
  
  return jwt.sign(obj, process.env.SECRETKEY )

}

router.get('/', async (req, res) => {
    console.log("entra");
  let obj = {};
  const token = req.headers.authorization;
  console.log(token);
  console.log(process.env.SECRETKEY);
  obj = jwt.verify(token, process.env.SECRETKEY);

  try {
    const getUser = await Usuario.findOne({email:obj.usuario});
    console.log(getUser);
    res.json({
      nombre: getUser.nombre,
      apellidos:getUser.apellidos,
      usuario:getUser.email,
      autenticado : true,
    })
  }

  catch(error) {
    res.send("error");
  }
})

router.post('/log', async (req, res) => {
    console.log(req.body);
  try {
    const findUser = await Usuario.findOne({email:req.body.email})

    if(!findUser) {
      res.json({error:"No se encuentra ningun usuario"});
    }

    const iguales = bcrypt.compareSync(req.body.password, findUser.password);
    
    if(!iguales) {
      res.json({error:"Usuario o contraseña erróneos"});
    }

    res.json({
      nombre: findUser.nombre,
      apellidos: findUser.apellidos,
      email: findUser.email,
      token: crearToken(findUser)
    })
  }

  catch(error) {
    console.log(error);
  }

});




module.exports = router;

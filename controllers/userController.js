const bcrypt = require('bcryptjs')
const validateIn = require('../lib/utils/validation').validateIn
const response = require('../lib/utils/response').response
const autentication = require('../autentication.js')
const users = require('../models/userModel.js')
const sendEmail = require('../lib/utils/emails').sendEmail
const template = require('../lib/utils/codeTemplate').template
const files = require('../lib/cloudinaryConfig.js')

const BCRYPT_SALT_ROUNDS = 12

const registerRules = {
  email: 'required|email',
  password: 'required|string',
  phoneNumber: 'required|string'
}

const addVehicleRules = {
  plate: 'required|string',
  brand: 'required|string',
  model: 'required|string',
  year: 'required|string',
  color: 'required|string',
  vehicle_capacity: 'required|string'
}

const errorsMessageAddVehicle = {
  'required.plate': 'La placa de el vehiculo es necesaria.',
  'required.brand': 'La marca del vehiculo es necesaria.',
  'required.model': 'El modelo del vehiculo es  necesario.',
  'required.year': 'El año del vehiculo es  necesario.',
  'required.color': 'El color del vehiculo es  necesario.',
  'required.vehicle_capacity': 'La capacidad del vehiculo es  necesaria.',
}

const errorsMessage = {
  'required.email': 'El correo electrónico de la usb es necesario.',
  'required.password': 'La contraseña es necesaria.',
  'required.phoneNumber': 'El teléfono celular es necesario.'
}

const create = (dataUser) => {
  const { email, password, phoneNumber } = dataUser
  return users.create({
    email: email,
    password: password,
    phone_number: phoneNumber,
    temporalCode: codeGenerate()
  })
}

const updateCode = async (email, code = undefined) => {
  const query = { email: email }
  const update = {
    $set: {
      temporalCode: code || codeGenerate()
    }
  }
  return users.updateOne(query, update)
    .then(usr => {
      return usr
    })
    .catch(err => {
      console.log('Error in update code: ', err)
    })
}

const codeGenerate = () => {
  return Math.floor(Math.random() * (99999 - 9999)) + 9999
}

const createHTMLRespose = (code, userName = '') => {
  const html = template(code, userName)
  return html
}

const responseCreate = async (usr, res, alredy = false) => {
  const code = alredy ? codeGenerate() : usr.temporalCode
  if (alredy) await updateCode(usr.email, code)

  sendEmail(usr.email, 'Bienvenido a Pide Cola USB, valida tu cuenta.', createHTMLRespose(code, usr.email.split('@')[0]))
    .then(() => {
      const userInf = { email: usr.email, phoneNumber: usr.phone_number }
      return res.status(200).send(response(true, userInf, 'Usuario creado.'))
    })
    .catch(error => {
      console.log('Error Sendig Mail', error)
      return res.status(500).send(response(false, error, 'Perdon, ocurrio un error.'))
    })
}

const updateUserByEmail = (email, query) => {
  return users.findOneAndUpdate({ email: email }, query, { returnOriginal: false })
}

exports.findByEmail = (email, querySelect = { password: 0 }) => {
  return users.findOne({ email: email }, querySelect)
}

exports.getPic = (email) => {
  return users.findOne({ email: email }).select('profile_pic')
}

exports.create = async (req, res) => {
  const validate = validateIn(req.body, registerRules, errorsMessage)

  if (!validate.pass) return res.status(400).send(response(false, validate.errors, 'Ha ocurrido un error en el proceso'))

  const alredyRegister = await this.findByEmail(req.body.email)

  // if(alredyRegister)
  if (alredyRegister && alredyRegister.isVerify) return res.status(403).send(response(false, '', 'El usuario ya se encuentra registrado.'))
  else if (alredyRegister && !alredyRegister.isVerify) return responseCreate(alredyRegister, res, true)

  bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS)
    .then(hashedPassword => {
      req.body.password = hashedPassword
      return create(req.body)
    })
    .then(usr => {
      return responseCreate(usr, res)
    })
    .catch(err => {
      let mssg = 'Usuario no ha sido creado.'
      if (err && err.code && err.code === 11000) mssg = 'Ya existe usuario.'
      return res.status(500).send(response(false, err, mssg))
    })
}

exports.updateUser = (req, res) => {
  const email = req.secret.email
  if (!email) return res.status(401).send(response(false, '', 'El Email es necesario.'))
  const query = {
    $set: {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
      phone_number: req.body.phone_number,
      major: req.body.major
    }
  }
  updateUserByEmail(email, query)
    .then(usr => {
      return res.status(200).send(response(true, usr, 'El Usuario fue actualizado.'))
    })
    .catch(err => {
      return res.status(500).send(response(false, err, 'Error, El usuario no fue actualizado.'))
    })
}

exports.addVehicle = (req, res) => {
  const email = req.secret.email
  const file = req.file
  if(!file) res.status(401).send(response(false, '', 'File is requires'))
  if (!email) return res.status(401).send(response(false, '', 'El Email es necesario.'))

  const validate = validateIn(req.body, addVehicleRules, errorsMessageAddVehicle)
  if (!validate.pass) return res.status(400).send(response(false, validate.errors, 'Los campos requeridos deben ser enviados.'))

  this.findByEmail(email)
  .then( async user => {
    let existVehicle
    if(user.vehicles && user.vehicles.length)existVehicle = user.vehicles.find( vehicle => vehicle.plate === req.body.plate)
    else user.vehicles = []
    
    if(existVehicle) return res.status(403).send(response(false, error, 'Vehiculo ya existe.')) 

    let picture = await files.uploadFile(file.path)
    if(!picture) return res.status(500).send(response(false, '', 'Ocurrio un error en el proceso, disculpe.'))

    user.vehicles.push({
      plate: req.body.plate,
      brand: req.body.brand,
      model: req.body.model,
      year: req.body.year,
      color: req.body.color,
      vehicle_capacity: req.body.vehicle_capacity,
      vehicle_pic: picture.secure_url
    })

    user.markModified('vehicles')
    user.save( (err, usr) => {
      if(err) return res.status(500).send(response(false, err, 'Vehiculo no fue agregado'))
      return res.status(200).send(response(true, usr, 'Vehiculo agregado.'))
    })
    
  })
  .catch( error => {
    return res.status(500).send(response(false, error, 'Vehiculo no fue agregado'))
  })
}

exports.codeValidate = async (req, res) => {
  const { code, email } = req.body
  if (!code) res.status(403).send(response(false, '', 'El codigo es necesario.'))
  if (!email) res.status(401).send(response(false, '', 'El email es necesario.'))

  const user = await this.findByEmail(email)
  if (!user) res.status(401).send(response(false, '', 'El usuario no fue encontrado, debe registrarse nuevamente.'))
  if (user.temporalCode !== parseInt(code)) return res.status(401).send(response(false, '', 'El codigo es incorrecto.'))
  user.isVerify = true
  user.markModified('isVerify')
  user.save()
  return res.status(200).send(response(true, [{ tkauth: autentication.generateToken(user.email) }], 'Success.'))
}

exports.getUserInformation = (req, res) => {
  const email = req.secret.email
  if (!email) return res.status(401).send(response(false, '', 'El Email es necesario.'))
  this.findByEmail(email)
    .then(usr => {
      return res.status(200).send(response(true, usr, 'Peticion ejecutada con exito.'))
    })
    .catch(err => {
      return res.status(500).send(response(false, err, 'Error, El usuario no fue encontrado o hubo un problema.'))
    })
}
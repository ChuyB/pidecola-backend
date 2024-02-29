'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String },
    age: { type: Number },
    gender: { type: String, enum: ['M', 'F', 'O'] },
    major: {
      type: String,
      enum:
      ['Ing. Eléctrica', 'Ing. Mecánica', 'Ing. Química', 'Ing. Electrónica', 'Ing. de Materiales',
        'Ing. de Computación', 'Ing. Geofísica', 'Ing. de Producción', 'Ing. de Telecomunicaciones',
        'Arquitectura', 'Urbanismo', 'Lic. en Química', 'Lic. en Matemáticas', 'Lic. en Física', 'Lic. en Biología',
        'Lic. en Comercio Internacional', 'Lic. en Estudios y Artes Liberales', 'Economía']
    },
    profile_pic: { type: String },
    status: { type: String, enum: ['Disponible', 'No Disponible'] },
    community: { type: String, enum: ['Estudiante', 'Profesor', 'Egresado', 'Personal Administrativo', 'Obrero'] },
    vehicles:
        [{
          plate: { type: String },
          brand: { type: String },
          model: { type: String },
          year: { type: Number },
          color: { type: String },
          vehicle_capacity: { type: Number },
          vehicle_pic: { type: String }
        }],
    license: { type: String },
    rides_given: { type: Number },
    rides_recieved: { type: Number },
    likes_count: { type: Number },
    dislikes_count: { type: Number },
    last_ride: { type: Schema.Types.ObjectId, ref: 'Ride' },
    frequent_routes: { type: Array },
    isVerify: { type: Boolean },
    temporalCode: { type: Number },
    titles: [ String ]

  }, {
    timestamps: true
  }
)

const User = mongoose.model('user', UserSchema)
module.exports = User

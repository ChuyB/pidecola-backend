"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RideSchema = new Schema({
  rider: { type: Schema.Types.ObjectId, ref: "User", required: true },
  passenger: { type: Array, required: true },
  available_seats: { type: Number },
  status: {
    type: String,
    enum: ["En Espera", "En Camino", "Finalizado", "Accidentado"],
  },
  start_location_id: { type: Schema.Types.ObjectId, ref: "Route" },
  destination_id: { type: Schema.Types.ObjectId, ref: "Route" },
  time: { type: Date },
  ride_finished: { type: Boolean },
  comments: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: "User" },
      like: { type: Boolean },
      dislike: { type: Boolean },
      comment: { type: "String" },
    },
  ],
});

const Ride = mongoose.model("ride", RideSchema);
module.exports = Ride;

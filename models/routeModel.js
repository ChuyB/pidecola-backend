"use strict";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RouteSchema = new Schema({
  route_id: { type: Schema.Types.ObjectId },
  name: { type: String, required: true },
});

const Route = mongoose.model("route", RouteSchema);
module.exports = Route;

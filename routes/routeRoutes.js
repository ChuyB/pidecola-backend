const express = require("express");
const router = express.Router();
const routeController = require("../controllers/routeController.js");

// GET
router.get("/", routeController.getAllRoutesNames);

// POST
router.post("/", routeController.addNewRoute);

// DELETE
router.delete("/", routeController.deleteRouteByName);

// PUT
router.put("/", routeController.updateRouteByName);

module.exports = router;

const express = require('express')
const router = express.Router()
const rideController = require('../controllers/rideController.js')

// POSTs
router.post('/create', rideController.create)

// PUTs
router.put('/endRide', rideController.endRide)
router.put('/changeStatus', rideController.changeStatus)
router.put('/commentARide', rideController.commentARide)

module.exports = router

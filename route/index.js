const express = require('express')
const router = express.Router()
const roomRoute = require('./roomRoute')
const guestRoute = require('./guestRoute')

router.use('/reports/room_data',roomRoute)
router.use('/reports',guestRoute)


module.exports=router



const express = require('express')
const router = express.Router()
const roomRoute = require('./roomRoute')
const guestRoute = require('./guestRoute')

router.use('/api/room_data',roomRoute)
router.use('/api',guestRoute)


module.exports=router



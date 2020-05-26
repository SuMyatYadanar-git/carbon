const express = require('express')
const router = express.Router()
const roomRoute = require('./roomRoute')
const guestRoute = require('./guestRoute')
const userRoute = require('./userRoute')
const {authenticationMiddleware} = require('./middleware')

router.use('/api',userRoute)
router.use(authenticationMiddleware)
router.use('/api/room_data',roomRoute)
router.use('/api',guestRoute)



module.exports=router



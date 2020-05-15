const express = require('express')
const router = express.Router()
const roomInfoController = require('../controller/roomInfoController')
const guestDetailController = require('../controller/guestDetailController')

// http://localhost:5000/reports/room_data/room_info?room_no=301&hotel_id=1
// http://sample.evercomm.com/reports/room_data/room_info/?room_no=301&hotel_id=1
router.get("/room_info",roomInfoController.getRoomInfoById)

// http://localhost:5000/reports/room_data/energy/302?start_date=2020-01-01&end_date=2020-01-02
// http://sample.evercomm.com/reports/room_data/energy/:id?start_date&end_date
router.get("/energy/:id",roomInfoController.getRoomEnergyConsumption)

// http://localhost:5000/reports/room_data/carbon/302?start_date=2020-01-01&end_date=2020-01-02
// http://sample.evercomm.com/reports/room_data/carbon/id?start_date=2020-01-01&end_date=2020-01-02
router.get("/carbon/:id",roomInfoController.getRoomCarbonFootPrint)

// http://sample.evercomm.com/reports/room_data?start_date=2020-03-03&end_date=2020-03-04&hotel_id=1&room_no=301
// http://localhost:5000/reports/room_data/?start_date=2020-03-03&end_date=2020-03-04&hotel_id=1&room_no=301
// router.get("/",roomInfoController.getRoomData)

// http://localhost:5000/reports/room_data/hotel_info
// http://sample.evercomm.com/reports/room_data/hotel_info
router.get('/hotel_info',roomInfoController.getHotelInfo)

module.exports=router

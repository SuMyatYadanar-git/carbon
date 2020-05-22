const roomInfoService = require('../service/roomInfoService')
const { sub, set, add, parseISO, format, isBefore } = require('date-fns')
const response = require("../config/response");
const error_code = require("../config/error");
const dateFns = require("date-fns");

//api for get room info by id
const getRoomInfoById = (req, res) => {
    const room_id = req.query.room_no
    const hotel_id = req.query.hotel_id

    if (!room_id || !hotel_id) {
        return res.status(400).json(response({
            success: false,
            error: -1004,
            message: error_code[-1004]
        }))
    }
    try {
        roomInfoService.getRoomInfoById(room_id, hotel_id).then(data => {
            return res.json(response({
                success: true,
                payload: data[0]
            }))
        }).catch(error => {
            return res.status(500).json(response({
                success: false,
                error: error.code ? error.errno : -1012,
                message: error.code ? error_code[error.errno] : error_code[-1012]
            }))
        })
    }
    catch (error) {
        //catching the error such reference error
        return res.status(500).json(response({
            success: false,
            error: -1003,
            message: error_code[-1003],
            
        }))
    }

}

// api for get energy consumpton by room id ,startdate,enddate
const getRoomEnergyConsumption = (req, res) => {
    const no = req.params.id
    const startDate = req.query.start_date
    const endDate = req.query.end_date
    if (!startDate || !endDate) {
        return res.status(400).json(response({
            success: false,
            error: -1004,
            message: error_code[-1004]
        }))
    }
    else if(!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))){
        return res.status(400).json(response({
            success: false,
            error: -1013,
            message: error_code[-1013]
        }))
    }else if(Date.parse(startDate) > Date.parse(endDate)){
       return res.status(400).json(response({
        success: false,
        error:-1014,
        message:error_code[-1014]
       }))
    }
    try {
        return roomInfoService.getRoomEnergyConsumption(no, startDate, endDate).then(data => {
            return res.json(response({
                success: true,
                payload: data[0].map(v => {
                    return ({
                        ts: format(new Date(v.ts), "yyyy-MM-dd HH:mm"),
                        kWh: v.energyConsumption.toFixed(3) ,
                        dataColor: v.dataColor,
                    })
                })
            }))
        }).catch(error => {
            return res.status(500).json(response({
                success: false,
                error: error.code ? error.errno : -1012,
                message: error.code ? error_code[error.errno] : error_code[-1012]
            }))
        })

    } catch (error) {
        return res.status(500).json(response({
            success: false,
            error: -1003,
            message: error_code[-1003]
        }))
    }
}

//get carbon footprint by room id,startdate,enddate
const getRoomCarbonFootPrint = (req, res) => {
    const id = req.params.id
    const startDate = req.query.start_date
    const endDate = req.query.end_date

    if (!startDate || !endDate) {
        return res.status(400).json(response({
            success: false,
            error: -1004,
            message: error_code[-1004]
        }))
    }
    else if(!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))){
        return res.status(400).json(response({
            success: false,
            error: -1013,
            message: error_code[-1013]
        }))
    }
   else  if(startDate > endDate){
        return res.status(400).json(response({
                 success: false,
                 error:-1014,
                 message:error_code[-1014]
                }))
    }else if(Date.parse(startDate) > Date.parse(endDate)){
        return res.status(400).json(response({
         success: false,
         error:-1014,
         message:error_code[-1014]
        }))
     }
    try {
        return roomInfoService.getRoomCarbonFootPrint(id, startDate, endDate).then(data => {
            return res.json(response({
                success: true,
                payload: data,
                error: null,
            }))
        }).catch(error => {
            return res.status(500).json(response({
                success: false,
                error: error.code ? error.errno : -1012,
                message: error.code ? error_code[error.errno] : error_code[-1012]
            }))
        })

    } catch (error) {
        return res.status(500).json(response({
            success: false,
            error: -1003,
            message: error_code[-1003]
        }))
    }
}

// get room_data
const getRoomData = (req, res) => {
    const startDate = req.query.start_date
    const endDate = req.query.end_date
    const hotel_id = req.query.hotel_id
    const room_id = req.query.room_no

    if (!startDate || !endDate || !hotel_id || !room_id) {
        return res.status(400).json(response({
            success: false,
            error: -1004,
            message: error_code[-1004]
        }))
    }
    else if(!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))){
        return res.status(400).json(response({
            success: false,
            error: -1013,
            message: error_code[-1013]
        }))
    }
    try {
        return roomInfoService.getRoomData(startDate, endDate, hotel_id, room_id).then(data => {
            return res.json(response({
                success: true,
                hotel_id: data.hotel_id,
                room: data.room,
                energy: data.energy,
                error: null,
            }))
        }).catch(error => {
            return res.status(500).json(response({
                success: false,
                error: error.code ? error.errno : -1012,
                message: error.code ? error_code[error.errno] : error_code[-1012]
            }))
        })

    } catch (error) {
        return res.status(500).json(response({
            success: false,
            error: -1003,
            message: error_code[-1003]
        }))
    }
}

// get hotel_info
const getHotelInfo = (req, res) => {
    try {
        return roomInfoService.getHotelInfoData()
            .then(data => {
                return res.json({
                    success: true,
                    payload: data[0].length > 0 ? data[0] : [],
                    error: null,
                })
            })
            .catch(error => {
                return res.status(500).json(response({
                    success: false,
                    error: error.code ? error.errno : -1012,
                    message: error.code ? error_code[error.errno] : error_code[-1012]
                }))
            })
    } catch (error) {
        return res.status(500).json(response({
            success: false,
            error: -1003,
            message: error_code[-1003]
        }))
    }
}
module.exports = {
    getRoomInfoById, getRoomEnergyConsumption, getRoomCarbonFootPrint, getRoomData, getHotelInfo
}
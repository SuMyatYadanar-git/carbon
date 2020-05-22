const roomInfoService = require('../service/roomInfoService')
const { sub, set, add, parseISO, format, isBefore } = require('date-fns')
const response = require("../config/response");
const dateFns = require("date-fns");

//api for get room info by id

const getRoomInfoById = (req, res, next) => {
    const hotel_id = req.query.hotel_id
    const room_id = req.query.room_no

    try {
        if (!hotel_id || !room_id) {

            return next({
                status: 400,
                error: { errno: -1004 }
            })
            // return res.status(400).json(response({
            //     success: false,
            //     error: -1004,
            //     message: error_code[-1004]
            // }))

        }
        roomInfoService.getRoomInfoById(room_id, hotel_id).then(data => {
            return res.json(response({
                success: true,
                payload: data[0]
            }))
        }).catch(error => {
            return next({
                status: 400,
                error: error
            })
        })
    }
    catch (error) {
        //catching the error such reference error

        return next(
            { status: 500, error: -1003 }
        )

    }

}

// api for get energy consumpton by room id ,startdate,enddate

const getRoomEnergyConsumption = (req, res, next) => {

    const hotelId = req.query.hotel_id
    const no = req.query.room_no
    const startDate = req.query.start_date
    const endDate = req.query.end_date
    console.log(hotelId, 'hotel')
    if (!startDate || !endDate) {


        return next({
            status: 400,
            error: { errno: -1004 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1004,
        //     message: error_code[-1004]
        // }))
    }

    else if (!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))) {
        return next({
            status: 400,
            error: { errno: -1013 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1013,
        //     message: error_code[-1013]
        // }))
    } else if (Date.parse(startDate) > Date.parse(endDate)) {
        return next({
            status: 400,
            error: { errno: -1014 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1014,
        //     message: error_code[-1014]
        // }))
    }
    else if (!hotelId) {
        return next({
            status: 400,
            error: { errno: -1004 }
        })
    }
    
    try {

        return roomInfoService.getRoomEnergyConsumption(hotelId, no, startDate, endDate).then(data => {
            return res.json(response({
                success: true,
                payload: data[0].map(v => {
                    return ({
                        ts: format(new Date(v.ts), "yyyy-MM-dd HH:mm"),

                        kWh: v.energyConsumption.toFixed(3),
                        dataColor: v.dataColor,
                    })
                })
            }))
        }).catch(error => {
            console.log(error)

            return next(
                { status: 500, error: error }
            )
            // return res.status(500).json(response({
            //     success: false,
            //     error: error.code ? error.errno : -1012,
            //     message: error.code ? error_code[error.errno] : error_code[-1012]
            // }))
        })

    } catch (error) {

        return next({ status: 500, error: { errno: -1003 } })

        // return res.status(500).json(response({
        //     success: false,
        //     error: -1003,
        //     message: error_code[-1003]
        // }))
    }
}

//get carbon footprint by room id,startdate,enddate

const getRoomCarbonFootPrint = (req, res, next) => {

    const hotelId = req.query.hotel_id
    const id = req.query.room_no
    const startDate = req.query.start_date
    const endDate = req.query.end_date

    if (!hotelId) {

        return next({
            status: 400,
            error: { errno: -1004 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1004,
        //     message: error_code[-1004]
        // }))
    }

    else if (!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))) {
        return next({
            status: 400,
            error: { errno: -1013 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1013,
        //     message: error_code[-1013]
        // }))
    }

    else if (Date.parse(startDate) > Date.parse(endDate)) {
        return next({
            status: 400,
            error: { errno: -1014 }
        })
    }
    try {

        return roomInfoService.getRoomCarbonFootPrint(hotelId, id, startDate, endDate).then(data => {
            return res.json(response({
                success: true,
                payload: data,
                error: null,
            }))

        }).catch(error => {
            return next(
                { status: 500, error: error }
            )
            // return res.status(500).json(response({
            //     success: false,
            //     error: error.code ? error.errno : -1012,
            //     message: error.code ? error_code[error.errno] : error_code[-1012]
            // }))
        })

    } catch (error) {


        return next({ status: 500, error: { errno: -1003 } })
        // return res.status(500).json(response({
        //     success: false,
        //     error: -1003,
        //     message: error_code[-1003]
        // }))

    }
}

// get room_data

const getRoomData = (req, res, next) => {
    const startDate = req.query.start_date
    const endDate = req.query.end_date
    const hotel_id = req.query.hotel_id
    const room_id = req.query.room_no

    if (!startDate || !endDate || !hotel_id || !room_id) {


        return next({
            status: 400,
            error: { errno: -1004 }
        })
        // return res.status(400).json(response({
        //     success: false,
        //     error: -1004,
        //     message: error_code[-1004]
        // }))
    }

    else if (!dateFns.isValid(new Date(startDate)) || !dateFns.isValid(new Date(endDate))) {

        return next({
            status: 400,
            error: { errno: -1013 }
        })
    }
    else if (Date.parse(startDate) > Date.parse(endDate)) {
        return next({
            status: 400,
            error: { errno: -1014 }
        })
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

            return next(
                { status: 500, error: error }
            )
            // return res.status(500).json(response({
            //     success: false,
            //     error: error.code ? error.errno : -1012,
            //     message: error.code ? error_code[error.errno] : error_code[-1012]
            // }))
        })

    } catch (error) {

        return next({ status: 500, error: { errno: -1003 } })
    }
}

// get hotel_info

const getHotelInfo = (req, res, next) => {
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

                return next(
                    { status: 500, error: error }
                )
                // return res.status(500).json(response({
                //     success: false,
                //     error: error.code ? error.errno : -1012,
                //     message: error.code ? error_code[error.errno] : error_code[-1012]
                // }))
            })

    } catch (error) {

        return next({ status: 500, error: { errno: -1003 } })
    }
}
module.exports = {
    getRoomInfoById, getRoomEnergyConsumption, getRoomCarbonFootPrint, getRoomData, getHotelInfo
}
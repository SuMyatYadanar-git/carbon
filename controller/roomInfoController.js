const roomInfoService=require('../service/roomInfoService')
const {sub,set,add,parseISO,format,isBefore}  = require('date-fns')
const error_code = require('../error')
const response = require('../config/response')

//api for get room info by id
const getRoomInfoById=(req,res)=>{
    const room_id=req.query.room_no
    const hotel_id=req.query.hotel_id
    roomInfoService.getRoomInfoById(room_id,hotel_id).then(data=>{
      return res.json({
          success:true,
          payload: data[0].length>0?data[0]:[],
          error:null,
      })
    }).catch(error=>{
        if(error.errno == 1054 ){
            return res.status(400).json({
                // error:error_code["-1004"],
                success:false,
                error:-1004,
            })
        }else{
            console.log(error,'room_info_id')
            return  res.status(503).json({
                    // error:error_code["-1008"],
                    success:false,
                    error:-1008,
                    message:error
                })
        }
        // return res.status(400).json({
        //     success:false,
        //     payload:null, 
        //     error:error.errno
        // })
    })
}

// api for get energy consumpton by room id ,startdate,enddate
const getRoomEnergyConsumption=(req,res)=>{
    const no = req.params.id
    const startDate=req.query.start_date
    const endDate=req.query.end_date
    return roomInfoService.getRoomEnergyConsumption(no,startDate,endDate).then(data=>{
        return res.json({
            success:true,
            payload:data[0].map(v=>{
                return ({
                    ts: format(new Date(v.ts), "yyyy-MM-dd HH:mm"),
                     kWh: v.energyConsumption.toFixed(3),
                     dataColor: v.dataColor,
                })
            }),
            error:null,
        })
    }).catch(error=>{
        if(error.errno == 1054 ){
            return res.status(400).json({
                // error:error_code["-1004"],
                success:false,
                error:-1004,
            })
        }else{
            console.log(error,'energy')
            return  res.status(503).json({
                    success:false,
                    error:-1008,
                })
        }
        // return res.status(400).json({
        //     success:false,
        //     payload:null,
        //     error:error
        // })
    })
}

//get carbon footprint by room id,startdate,enddate
const getRoomCarbonFootPrint=(req,res)=>{
    const id = req.params.id
    const startDate=req.query.start_date
    const endDate=req.query.end_date
    return roomInfoService.getRoomCarbonFootPrint(id,startDate,endDate).then(data=>{
        return res.json({
            success:true,
            payload:data,
            error:null,
        })
    }).catch(error=>{
        if(error.errno == 1054 ){
            return res.status(400).json({
                // error:error_code["-1004"],
                success:false,
                error:-1004,
            })
        }else{
            console.log(error,'carbon')
            return  res.status(503).json({
                    success:false,
                    error:-1008,
                    // message:error
                })
        }
        // return res.status(400).json({
        //     success:false,
        //     payload:null,
        //     error:error,
        // })
    })
}

// get room_data
const  getRoomData=(req,res)=>{
    const startDate=req.query.start_date
    const endDate=req.query.end_date
    const hotel_id=req.query.hotel_id
    const room_id=req.query.room_no
    
return roomInfoService.getRoomData(startDate,endDate,hotel_id,room_id).then(data=>{
      return res.json({
        success:true,
        hotel_id:data.hotel_id,
        room:data.room,
        energy:data.energy,
        error:null,
      })
    }).catch(error=>{
        if(error.errno == 1054 ){
            return res.status(400).json({
                success:false,
                error:-1004,
            })
        }else{
            console.log(error,'room_data')
            return  res.status(503).json({
                    // error:error_code["-1008"],
                    success:false,
                    error:-1008,
                    // message:error
                })
        }
        // return res.status(400).json({
        //     success:false,
        //     payload:null,
        //     error:error,
        // })
    })
}

// get hotel_info
const getHotelInfo=(req,res)=>{
    return roomInfoService.getHotelInfoData()
    .then(data=> {
        return res.json({
            success:true,
            payload:data[0].length>0?data[0]:[],
            error:null,
        })
    })
    .catch(error =>{
        if(error.errno == 1054 ){
            return res.status(400).json({
                // error:error_code["-1004"],
                success:false,
                error:-1004,
            })
        }else{
            console.log(error,'hotel_info')
            return  res.status(503).json({
                    // error:error_code["-1008"],
                    success:false,
                    error:-1008,
                    // message:error
                })
        }
        // return res.status(400).json({
        //     success:false,
        //     payload:null ,
        //     error:error,
        // })
    })
}
module.exports={
    getRoomInfoById,getRoomEnergyConsumption,getRoomCarbonFootPrint, getRoomData ,getHotelInfo}
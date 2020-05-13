const roomInfoService=require('../service/roomInfoService')
const {sub,set,add,parseISO,format,isBefore}  = require('date-fns')
const error_code = require('../error')

//api for get room info by id
const getRoomInfoById=(req,res)=>{
    const room_id=req.query.room_no
    const hotel_id=req.query.hotel_id
    // console.log(room_id,hotel_id,'controller')
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
    const id = req.params.id
    const startDate=req.query.start_date
    const endDate=req.query.end_date
    // return roomInfoService.hourlyEnergy(id,startDate,endDate)
//@old-version=========================================================================================================
    return roomInfoService.getRoomEnergyConsumption(id,startDate,endDate).then(data=>{
        return res.json({
            success:true,
            payload:data.length >0 ? data :null,
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
                    // error:error_code["-1008"],
                    success:false,
                    error:-1008,
                    // message:error
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
          payload:(data.length>0 && data[0].room_id !== null)?data.map(d=>({
              room_no:d.room_id,
              carbon:d.carbonFootPrint,
              offset:parseFloat(d.offset.toFixed(3)),
              unit:'SGD'
            })):
          [],
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
    .catch(err =>{
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
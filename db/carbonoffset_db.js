const mysql = require('mysql2')

const con1 = mysql.createConnection({
    host     : 'localhost',
    user     : 'kumo99',
    password : 'root',
    database : 'carbon_offset_db'
  })
  const con3 = mysql.createConnection({
    host     : '114.32.125.70',
    port     :'33061',
    user     : 'kumo',
    password : 'kumo99',
    database : 'iotmgmt'
  })

  const con2 = mysql.createConnection({
    host     : '202.73.49.62',
    user     : 'ecoui',
    password : 'ECO4ui17',
    database : 'iotmgmt'
  })


// const getFlowRate =(startDate,endDate)=>{
//   return con2.promise().query(`SELECT flowRate,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM ppss_orchard_road.plant_eva_flowrate where ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00') `)
//  }
// const getCh1EvaReturnAndSupply=(startDate,endDate)=>{
//   return con2.promise().query(`SELECT temp2-temp1 as temp,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM ppss_orchard_road.ch1_eva_return_supply_temp where ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00') `)
// }

// const getCh1Power=(startDate,endDate)=>{
//   return con2.promise().query(`SELECT sum(ch1Watt+ch2Watt+ch3Watt)/1000 as power,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM ch1_component_power where ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00') `)
// }

// const getCh2Power=(startDate,endDate)=>{
//   return con2.promise().query(`SELECT sum(ch1Watt+ch2Watt+ch3Watt)/1000 as power,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM ch2_component_power where ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00') `)
// }

// const getCh2EvaReturnAndSupply=(startDate,endDate)=>{
//   return con2.promise().query(`SELECT temp2-temp1 as temp,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM ppss_orchard_road.ch2_eva_return_supply_temp where ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00') `)
// }

//  =============================================================================================
const chilled_water_flow_office = (startDate,endDate)=>{
  return con2.promise().query(`SELECT flowRate,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM ultrasonicFlow2 where ts between '${startDate}' and '${endDate}' and gatewayId=113 and ieee='ppssbms0023' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const chilled_water_flow = (startDate,endDate)=>{
  return con2.promise().query(`SELECT flowRate,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM ultrasonicFlow2 where ts between '${startDate}' and '${endDate}' and gatewayId=113 and ieee='ppssbms001d' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const hotel_plant_cooling_temp = (startDate,endDate)=>{
  return con2.promise().query(`SELECT temp2-temp1 as temp,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM dTemperature where gatewayId=113 and ieee='ppssbms001f' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const office_temp_0025 =(startDate,endDate)=>{
  return con3.promise().query(`SELECT temp1 ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM iotmgmt.dTemperature where gatewayId=113 and ieee='ppssbms0025' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const office_temp_0024 =(startDate,endDate)=>{
  return con3.promise().query(`SELECT temp1 ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts  FROM iotmgmt.dTemperature where gatewayId=113 and ieee='ppssbms0024' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const ch1 = (startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0013' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const ch2 =(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0014' and ts between '${startDate}' and '${endDate}'  group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const ch3 =(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0015' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const eva_water_pump1=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0016' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const eva_water_pump2=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0017' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const eva_water_pump3=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0018' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const con_water_pump1=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms0019' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const con_water_pump2=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms001a' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const con_water_pump3=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms001b' and ts between '${startDate}' and '${endDate}'  group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
const cooling_tower=(startDate,endDate)=>{
  return con2.promise().query(`SELECT ch1Watt ,date_format(ts,'%Y-%m-%d %H-%i-00') as ts FROM pm where gatewayId=113 and ieee='ppssbms001c' and ts between '${startDate}' and '${endDate}' group by date_format(ts,'%Y-%m-%d %H-%i-00')`)
}
// ====================================================================================================
const saveFourHourCalculatedData=(efficiency,ts)=>{
  return con1.promise().query(`insert into four_hour_calculated_data(ts,efficiency) values ('${ts}',${efficiency})`)
}
// old-version
const getEFficiencyMedian=(ts)=>{
  console.log(ts,'TS')
  return con1.promise().query(`select * from four_hour_calculated_data where ts='${ts}'`)
}
const loadMedianEfficiency=()=>{
  return con1.promise().query(`select * from four_hour_calculated_data`);
}
// new
const efficiencyMedianValue=(startDate,endDate)=>{
  return con1.promise().query(`select * from four_hour_calculated_data where ts between '${startDate}' and '${endDate}'`)
}
// const getRoomInfo=()=>{
//   return con1.promise().query(`select distinct(room_type) as room_type,cooling_per_room from room_info`)
// }
const getRoomInfo=()=>{
  return con1.promise().query(`select * from room_info`)
}
const saveOneHourCalculatedData=(ts,roomType,kWH)=>{
  return con1.promise().query(`insert into one_hour_calculated_data(ts,room_type,kWh) values(?,?,?)`,[ts,roomType,kWH])
}
// get room info by id
const getRoomInfoById=(room_id,hotel_id)=>{
  // SELECT * FROM carbon_offset_db.room_info where room_id=301 and hotel_id=1
   return con1.promise().query(`select * from room_info where room_no=${room_id} and hotel_id=${hotel_id}`)
}

// get hourly room  energyConsumption old-version
const hourlyRoomEnergyConsumption=(id,startDate,endDate)=>{
  return con1.promise().query(`SELECT room_info.room_size_m2 as room_area, room_info.room_size_m2/room_info.cooling_required  as cooling, one_hour_calculated_data.kWh as kWh,one_hour_calculated_data.ts as ts,room_info.room_no as room_no,room_info.room_type as room_type from room_info inner join 
  one_hour_calculated_data on room_info.room_type=one_hour_calculated_data.room_type where room_info.room_no=${id} and one_hour_calculated_data.ts between '${startDate}' and '${endDate}' `)
 }
// new-version
// const hourlyRoomEnergyConsumption=(id,startDate,endDate)=>{
//   return con1.promise().query(`SELECT room_info.room_area as room_area, room_info.cooling_per_room as cooling, one_hour_calculated_data.kWh as kWh,one_hour_calculated_data.ts as ts,room_info.room_no as room_no,room_info.room_type as room_type from room_info inner join 
//   one_hour_calculated_data on room_info.room_type=one_hour_calculated_data.room_type where room_info.room_no=${id} and one_hour_calculated_data.ts between '${startDate}' and '${endDate}' `)
//  }
//  const hourlyRoomEnergyConsumption=(id,startDate,endDate)=>{
//   return con1.promise().query(`SELECT room_info.room_area as room_area, (room_info.room_size_m2)/(room_info.cooling_required) as cooling, four_hour_calculated_data.efficiency as kWh,four_hour_calculated_data.ts as ts,room_info.room_no as room_no,room_info.room_type as room_type from room_info inner join 
//   four_hour_calculated_data on room_info.room_type=one_hour_calculated_data.room_type where room_info.room_no=${id} and one_hour_calculated_data.ts between '${startDate}' and '${endDate}' `)
//  }

//get coefficient
const getCoefficient=()=>{
  return con1.promise().query(`select * from coefficient`)
}
// get hotel-info
const getHotelInfo=()=>{
  return con1.promise().query(`select * from hotel_info`)
}

// post guest-detail
const postGuestDetail = (firstName,lastName,roomNumber,checkInDate,checkOutDate)=>{
   return con1.promise().query(`insert into guest_info(first_name,last_name,room_no,checkin_datetime,checkout_datetime) values(?,?,?,?,?)`,[firstName,lastName,roomNumber,checkInDate,checkOutDate])
}

const newsLetter=(email)=>{
  return con1.promise().query(`insert into news_letter_tbl(email)values('${email}')`)
}
const newsLetterMailExist =(email)=>{
  return con1.promise().query(`select email from news_letter_tbl where email='${email}'`)
}
const postUserFeedback=(hours,room_temp,hotel_temp)=>{
  return con1.promise().query(`insert into feedback_tbl(hours_stayed,room_temp_level,hotel_building_temp_level) values(?,?,?)`,[hours,room_temp,hotel_temp])
}
// ====================================================================================================================================================================



module.exports={
  // old-version
//  getFlowRate,getCh1EvaReturnAndSupply,getCh1Power,
//  getCh2Power,getCh2EvaReturnAndSupply,
 saveFourHourCalculatedData,getEFficiencyMedian,getRoomInfo,
 saveOneHourCalculatedData,getRoomInfoById,getCoefficient,hourlyRoomEnergyConsumption,getHotelInfo,
 // guest
 postGuestDetail,newsLetter,newsLetterMailExist,postUserFeedback,
//  new-logic
chilled_water_flow_office,chilled_water_flow,hotel_plant_cooling_temp,
ch1,ch2,ch3,eva_water_pump1,eva_water_pump2,eva_water_pump3,con_water_pump1,con_water_pump2,con_water_pump3,cooling_tower,
efficiencyMedianValue,office_temp_0025,office_temp_0024,loadMedianEfficiency,
}  
 
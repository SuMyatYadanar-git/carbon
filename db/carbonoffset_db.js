const mysql = require("mysql2");
// mysql.createConnection
// const con1 = mysql.createPool({
//   host: "localhost",
//    user: "root",
//   //  user: "user125",
//   password: "root",
//   database: "carbon_offset_db",
//   waitForConnections: true,
// });
const con1 = mysql.createConnection({
  host: "localhost",
  user: "kumo99",
  password: "root",
  database: "carbon_offset_db",
  waitForConnections: true,
});
const con3 = mysql.createPool({
  host: "114.32.125.70",
  port: "33061",
  user: "kumo",
  password: "kumo99",
  database: "iotmgmt",
  waitForConnections: true,

  connectTimeout: 30000,
  //  database : 'iotdata',
  trace: true,
});
const con2 = mysql.createPool({
  host: "202.73.49.62",
  user: "ecoui",
  password: "ECO4ui17",
  database: "iotmgmt",
  waitForConnections: true,
  // database : 'iotdata'
});


const con4 = mysql.createPool({
  host: "114.32.125.70",
  port: "33061",
  user: "kumo",
  password: "kumo99",
  database: "iotdata",
  waitForConnections: true,

  connectTimeout: 30000,
  //  database : 'iotdata',
  trace: true,
});
const con5 = mysql.createPool({
  host: "202.73.49.62",
  user: "ecoui",
  password: "ECO4ui17",
  database: "iotdata",
  waitForConnections: true,
  // database : 'iotdata'
});

const pingAllDBs = () => {
  con1.query("Select 1")
  con2.query("Select 1")
  con3.query("Select 1")
  con4.query("Select 1")
  con5.query("Select 1")
  console.log("\nFinished ping to all databases.")
}

handleDisconnect(con3);
handleDisconnect(con1);
handleDisconnect(con2);

function handleDisconnect(client) {
  client.on("error", function (error) {
    try {

      console.error("\n> Re-connecting lost MySQL connection: " + client.config.host + " : " + error.code + " : " + error.message);
      if (!error.fatal) {
        console.error("not fatal");
        return;
      }
      // if (error.code !== 'PROTOCOL_CONNECTION_LOST')
      // if(error.code==="ECONNREFUSED") return handleDisconnect(client);
      let mysqlClient = mysql.createConnection(client.config);
      handleDisconnect(mysqlClient);
      return mysqlClient.connect();
    } catch (errorAgain) {
      console.error("Error again")
    }
  });
}

// developed by @nayhtet
// m114 or m202

const runIotMgmtQuery = async (db = "m114", query, isPrev) => {
  if (db === "m114") {
 
    return await isPrev ? con4.promise().query(query) : con3.promise().query(query);;
  } else {
    // suppose m202

    return await isPrev ? con5.promise().query(query) : con2.promise().query(query);;
  }
};
// ====================================================================================================
// @lucy
const saveResultedData = (data) => {
  //  console.log('queryTest==>',`
  //  insert into 
  //    resulted_data(roomNo, coolingRequired, roomType, officeCoolingLoad,hotelCoolingLoad,powerDataTotal,plantEfficiency,energyConsumption,startTs,dataColor) 
  //    values (
  //      ${data.roomNo},
  //      ${data.coolingRequired},
  //      '${data.roomType}',
  //      ${data.officeCoolingLoad},
  //      ${data.hotelCoolingLoad},
  //      ${data.powerDataTotal},
  //      ${data.plantEfficiency},
  //      ${data.energyConsumption},
  //      '${data.startTs}',
  //      '${data.dataColor}')`)
  return con1.promise().query(`
      insert into 
        resulted_data(roomNo, coolingRequired, roomType, officeCoolingLoad,hotelCoolingLoad,powerDataTotal,plantEfficiency,energyConsumption,startTs,dataColor) 
        values (
          ${data.roomNo},
          ${data.coolingRequired},
          '${data.roomType}',
          ${data.officeCoolingLoad},
          ${data.hotelCoolingLoad},
          ${data.powerDataTotal},
          ${data.plantEfficiency},
          ${data.energyConsumption},
          '${data.startTs}',
          '${data.dataColor}')`);
};
// saveResultedDataAraay for previous time

const saveResultedDataArray = (data, ts) => {
  // console.log('queryTest==>',`
  // insert into 
  //   resulted_data(roomNo, coolingRequired, roomType, officeCoolingLoad,hotelCoolingLoad,powerDataTotal,plantEfficiency,energyConsumption,startTs,dataColor) 
  //   values (
  //     ${data.roomNo},
  //     ${data.coolingRequired},
  //     '${data.roomType}',
  //     ${data.officeCoolingLoad},
  //     ${data.hotelCoolingLoad},
  //     ${data.powerDataTotal},
  //     ${data.plantEfficiency},
  //     ${data.energyConsumption},
  //     '${ts}',
  //     '${data.dataColor}')`)

  return con1.promise().query(`
    insert into 
      resulted_data(roomNo, coolingRequired, roomType, officeCoolingLoad,hotelCoolingLoad,powerDataTotal,plantEfficiency,energyConsumption,startTs,dataColor) 
      values (
        ${data.roomNo},
        ${data.coolingRequired},
        '${data.roomType}',
        ${data.officeCoolingLoad},
        ${data.hotelCoolingLoad},
        ${data.powerDataTotal},
        ${data.plantEfficiency},
        ${data.energyConsumption},
        '${ts}',

        '${data.dataColor}')`);
}
const getResultedData = (date, roomNo) => {

  console.log(date, "getResulted");
  return con1
    .promise()
    .query(`select * from resulted_data where startTs='${date}' and roomNo=${roomNo}`);
};

// one-hour energy-consumption for room_id,startdate and enddate

const oneHourEnergyConsumption = (hotelId,no, startDate, endDate) => {
  return con1
    .promise()
    .query(

      `SELECT result.energyConsumption,result.dataColor,result.startTs as ts,room.hotel_id  from resulted_data as result
      left join room_info as room on room.room_no = result.roomNo 
      where room.hotel_id=${hotelId} and result.roomNo=${no} and result.startTs between '${startDate}' and '${endDate}' `
    );
};
// get hourly room  energyConsumption for carbon-offset old-version

const hourlyRoomEnergyConsumption = (hotelId,id, startDate, endDate) => {
  return con1
    .promise()
    .query(

      `SELECT energyConsumption,startTs as ts,roomType from resulted_data as result
      left join room_info as room on room.room_no = result.roomNo
      where room.hotel_id=${hotelId} and result.roomNo=${id} and result.startTs between '${startDate}' and '${endDate}'`
    );
};
// get room info by id
const getRoomInfoById = (room_id, hotel_id) => {
  console.log(room_id,hotel_id,'query')
  return con1
    .promise()
    .query(
      `select * from room_info where room_no=${room_id} and hotel_id=${hotel_id}`
    );
};
const getRoomInfo = () => {
  return con1.promise().query(`select * from room_info`);
};

// get hotel-info
const getHotelInfo = () => {

  return con1.promise()
  .query(`select hotel.*,room.room_no from hotel_info as hotel left join room_info as room  on hotel.hotel_id = room.hotel_id `);
};


// post guest-detail
const postGuestDetail = (
  firstName,
  lastName,
  roomNumber,
  checkInDate,
  checkOutDate
) => {
  // console.log(checkOutDate,checkInDate)
  return con1
    .promise()
    .query(
      `insert into guest_info(first_name,last_name,room_no,checkin_datetime,checkout_datetime) values(?,?,?,?,?)`,
      [firstName, lastName, roomNumber, checkInDate, checkOutDate]
    );
};
// get guest-info

const getGuestInfoWithRoomNo = (roomNo,guestId,hotelId)=>{
  return con1.promise()

    .query(`select concat(guest.first_name,' ',guest.last_name) AS full_name,date_format(guest.checkin_datetime,'%Y-%m-%d %H:%i:%s  %p') as check_in,date_format(guest.checkout_datetime,'%Y-%m-%d %H:%i:%s  %p') as check_out,guest.room_no ,room.room_type  from carbon_offset_db.guest_info as guest
  left join carbon_offset_db.room_info as room  on guest.room_no = room.room_no

  where room.room_no=${roomNo}  and guest.guest_id=${guestId} and room.hotel_id=${hotelId}`)
}

const newsLetter = (email) => {
  return con1
    .promise()
    .query(`insert into news_letter_tbl(email)values('${email}')`);
};
const newsLetterMailExist = (email) => {
  return con1
    .promise()
    .query(`select email from news_letter_tbl where email='${email}'`);
};


const guestExits = () => {
  return con1.promise().query(`select * from guest_info`)
}

//24 hours with date currently available

const postUserFeedback = (hours, room_temp, hotel_temp, guestId) => {
  // console.log(hours,'query')
  // console.log(  `insert into feedback_tbl(hours_stayed,room_temp_level,hotel_building_temp_level,guest_id) values('${hours}', '${room_temp}', '${hotel_temp}',${guestId})`)
  return con1
    .promise()
    .query(
      `insert into feedback_tbl(hours_stayed,room_temp_level,hotel_building_temp_level,guest_id) values('${hours}', '${room_temp}', '${hotel_temp}',${guestId})`
    );
};

const getLastTimeData = (query) => {
  console.log(query);
  return con1
    .promise()
    .query(query);
}
const getErrorCodes = (code=-1012) => {
  const query = `select * from error_tbl where error_code=${code}`;
  return con1.promise().query(query);
}
// ====================================================================================================================================================================

module.exports = {
  saveResultedData,
  saveResultedDataArray,
  runIotMgmtQuery,
  getResultedData,
  getRoomInfo,
  getRoomInfoById,
  // getCoefficientgetCoefficient,
  oneHourEnergyConsumption,
  hourlyRoomEnergyConsumption,
  getHotelInfo,
  // guest
  postGuestDetail,
  getGuestInfoWithRoomNo,
  newsLetter,
  newsLetterMailExist,
  postUserFeedback,
  pingAllDBs,
  getLastTimeData,
  guestExits,
  getErrorCodes
};

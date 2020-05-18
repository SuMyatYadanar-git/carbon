const mysql = require("mysql2");
// mysql.createConnection
// const con1 = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "root",
//   database: "carbon_offset_db",
//   waitForConnections: true,
// });
const con1 = mysql.createConnection({
  host: "localhost",
  user: "kumo99",
  password: "root",
  database: "carbon_offset_db",
});
const con3 = mysql.createPool({
  host: "114.32.125.70",
  port: "33061",
  user: "kumo",
  password: "kumo99",
  database: "iotmgmt",
  waitForConnections: true,
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

const pingAllDBs = () => {
  con1.query("Select 1")
  con2.query("Select 1")
  con3.query("Select 1")
  console.log("\nFinished ping to all databases.")
}

handleDisconnect(con3);
handleDisconnect(con1);
handleDisconnect(con2);

function handleDisconnect(client) {
  client.on("error", function (error) {
    try {
      console.error("\n> Re-connecting lost MySQL connection: " + client.config.host + " : " + error.code + " : " + error.message );
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
const runIotMgmtQuery = async(db = "m114", query) => {
  if (db === "m114") {
    return await con3.promise().query(query);
  } else {
    // suppose m202
    return await con2.promise().query(query);
  }
};
// ====================================================================================================
// @lucy
const saveResultedData = (data) => {
  // console.log(data, "save resulted query");
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
const getResultedData = (date) => {
   console.log(date, "getResulted");
  return con1
    .promise()
    .query(`select * from resulted_data where startTs='${date}'`);
};

// one-hour energy-consumption for room_id,startdate and enddate
const oneHourEnergyConsumption = (no, startDate, endDate) => {
  return con1
    .promise()
    .query(
      `SELECT energyConsumption,dataColor,startTs as ts from resulted_data where roomNo=${no} and startTs between '${startDate}' and '${endDate}' `
    );
};
// get hourly room  energyConsumption for carbon-offset old-version
const hourlyRoomEnergyConsumption = (id, startDate, endDate) => {
   console.log(id, startDate, endDate, "carbon");
  return con1
    .promise()
    .query(
      `SELECT energyConsumption,startTs as ts,roomType from resulted_data where roomNo=${id} and startTs between '${startDate}' and '${endDate}'`
    );
};
// get room info by id
const getRoomInfoById = (room_id, hotel_id) => {
  return con1
    .promise()
    .query(
      `select * from room_info where room_no=${room_id} and hotel_id=${hotel_id}`
    );
};
const getRoomInfo = () => {
  return con1.promise().query(`select * from room_info`);
};

//get coefficient
// const getCoefficient = () => {
//   return con1.promise().query(`select * from coefficient`);
// };
// get hotel-info
const getHotelInfo = () => {
  return con1.promise().query(`select * from hotel_info`);
};

// post guest-detail
const postGuestDetail = (
  firstName,
  lastName,
  roomNumber,
  checkInDate,
  checkOutDate
) => {
  return con1
    .promise()
    .query(
      `insert into guest_info(first_name,last_name,room_no,checkin_datetime,checkout_datetime) values(?,?,?,?,?)`,
      [firstName, lastName, roomNumber, checkInDate, checkOutDate]
    );
};

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
const postUserFeedback = (hours, room_temp, hotel_temp) => {
  console.log(hours, room_temp, hotel_temp, "query");
  return con1
    .promise()
    .query(
      `insert into feedback_tbl(hours_stayed,room_temp_level,hotel_building_temp_level) values(?,?,?)`,
      [hours, room_temp, hotel_temp]
    );
};
// ====================================================================================================================================================================

module.exports = {
  saveResultedData,
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
  newsLetter,
  newsLetterMailExist,
  postUserFeedback,
  pingAllDBs,
};

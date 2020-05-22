const db = require("../db/carbonoffset_db");
const moment = require("moment");
const { sub, set, add, parseISO, format, isBefore } = require("date-fns");
const dateFns = require("date-fns");
const dateFnsZone = require("date-fns-tz");

// auto-run
const oneHourSchedulerAuto = () => {
  // new Date(2020,3,28,1,0,0)

  const timezone = "Asia/Singapore";
  // const timezone = "Asia/Yangon";

  const cDate = dateFnsZone.utcToZonedTime(new Date(), timezone);
  const currentDate = dateFns.setSeconds(dateFns.setMinutes(cDate, 0), 0); // HH:00:00

  //htookyaw add this
  const lastTimeSql = "select max(startTs) as startTs from resulted_data ";
  const lastTimePromise = db.getLastTimeData(lastTimeSql);
  return Promise.all([lastTimePromise]).then((values) => {

    const dateFormat = "yyyy-MM-dd HH:mm:ss";
    const ts = values[0][0].map(d => d.startTs);

    if (dateFns.isValid(new Date(ts))) {
      let dbStartDate = dateFnsZone.utcToZonedTime(new Date(ts), timezone);
      let dbStartTs = dateFns.setSeconds(dateFns.setMinutes(dbStartDate, 0), 0);

      let curDate = dateFnsZone.utcToZonedTime(new Date(), timezone);
      let curTs = dateFns.setSeconds(dateFns.setMinutes(curDate, 0), 0); // HH:00:00
      console.log("previous date", dbStartTs, "current timestamp ", dateFns.subHours(curTs, 1))
      if (dateFns.isAfter(dateFns.subHours(curTs, 1), dbStartTs)) { //dateFns.subHours(curTs, 1) > dbStartTs

        while (dateFns.isAfter(dateFns.subHours(curTs, 1), dbStartTs)) {

          curDate = dateFnsZone.utcToZonedTime(new Date(), timezone);
          curTs = dateFns.setSeconds(dateFns.setMinutes(curDate, 0), 0);
          dbStartTs = dateFns.addHours(dbStartTs, 1);
          oneHourScheduler(dbStartTs);

          console.log(dateFnsZone.format(curTs, dateFormat, { timeZone: timezone }), "start db", dateFnsZone.format(dbStartTs, dateFormat, { timeZone: timezone }))
        }

      }
      else {
        oneHourScheduler(currentDate);
      }

    } else oneHourScheduler(currentDate);
  })
}

// developed by @nayhtet
// make sure to call this method once an hour
const oneHourScheduler = (currentDate) => {
  const startDate = dateFns.subHours(currentDate, 1);
  const dateFormat = "yyyy-MM-dd HH:mm:ss";

  const timezone = "Asia/Singapore";
  // const timezone = "Asia/Yangon";

  console.log(
    "startDate: ",
    dateFnsZone.format(startDate, dateFormat, { timeZone: timezone }),
    "currentDate: ",
    dateFnsZone.format(currentDate, dateFormat, { timeZone: timezone })
  );


  //@htookyaw 
  const todayDate = dateFnsZone.utcToZonedTime(new Date(), timezone);
  const todayTs = dateFns.setSeconds(dateFns.setMinutes(todayDate, 0), 0);
  // const isPrev = dateFns.differenceInDays(startDate,todayTs)>1;
  const isPrev = dateFns.differenceInDays(todayTs, startDate) >= 1;

  const power202 = [
    "ppssbms0013",
    "ppssbms0014",
    "ppssbms0015",
    "ppssbms0016",
    "ppssbms0017",
    "ppssbms0018",
    "ppssbms0019",
    "ppssbms001a",
    "ppssbms001b",
    "ppssbms001c",
  ];
  const temp202 = ["ppssbms001f"];
  const flow202 = ["ppssbms001d", "ppssbms0023"];
  const temp114 = ["ppssbms0024", "ppssbms0025"];

  // Office cooling
  const officeCoolingLoadFlowRateSql = `select flowRate as value, ts from ultrasonicFlow2 where ieee in ('${
    flow202[1]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and flowRate is not null and flowRate>0 order by flowRate asc`;
  // console.log('officeflowRateSQL->',officeCoolingLoadFlowRateSql)
  const officeCoolingLoadFlowRatePromise = db.runIotMgmtQuery(
    "m202",
    officeCoolingLoadFlowRateSql,
    isPrev
  );
  const officeCoolingLoadTempInSql = `select temp1 as value, ts from dTemperature where ieee in ('${
    temp114[1]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and temp1 is not null and temp1>0 order by temp1 asc`;
  // console.log('officeCoolingLoadTempInSql->',officeCoolingLoadTempInSql)
  const officeCoolingLoadTempInPromise = db.runIotMgmtQuery(
    // "m114",
    "m202",
    officeCoolingLoadTempInSql,
    isPrev
  );
  const officeCoolingLoadTempOutSql = `select temp1 as value, ts from dTemperature where ieee in ('${
    temp114[0]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and temp1 is not null and temp1>0 order by temp1 asc`;
  const officeCoolingLoadTempOutPromise = db.runIotMgmtQuery(
    // "m114",
    "m202",
    officeCoolingLoadTempOutSql,
    isPrev
  );
  // hotel cooling
  const hotelCoolingLoadFlowRateSql = `select flowRate as value, ts from ultrasonicFlow2 where ieee in ('${
    flow202[0]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and flowRate is not null and flowRate>0 order by flowRate asc`;
  // console.log('hotelCoolingLoadFlowRateSql->',hotelCoolingLoadFlowRateSql)
  const hotelCoolingLoadFlowRatePromise = db.runIotMgmtQuery(
    "m202",
    hotelCoolingLoadFlowRateSql,
    isPrev
  );
  const hotelCoolingLoadTempInSql = `select temp2 as value, ts from dTemperature where ieee in ('${
    temp202[0]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and temp2 is not null and temp2>0 order by temp2 asc`;
  // console.log('hotelCoolingLoadTempInSql->',hotelCoolingLoadTempInSql)
  const hotelCoolingLoadTempInPromise = db.runIotMgmtQuery(
    "m202",
    hotelCoolingLoadTempInSql,
    isPrev
  );
  const hotelCoolingLoadTempOutSql = `select temp1 as value, ts from dTemperature where ieee in ('${
    temp202[0]
    }') and ts between '${dateFns.format(
      startDate,
      dateFormat
    )}' and '${dateFns.format(
      currentDate,
      dateFormat
    )}' and temp1 is not null and temp1>0 order by temp1 asc`;
  // console.log('hotelCoolingLoadTempOutSql->',hotelCoolingLoadTempOutSql)
  const hotelCoolingLoadTempOutPromise = db.runIotMgmtQuery(
    "m202",
    hotelCoolingLoadTempOutSql,
    isPrev
  );

  const powerDataSql = `select ch1Watt as value, ieee, ts from pm where ieee in (${getCommaSeparatedString(
    power202
  )}) and ts between '${dateFns.format(
    startDate,
    dateFormat
  )}' and '${dateFns.format(
    currentDate,
    dateFormat
  )}' and ch1Watt is not null and ch1Watt>0 order by value asc`;
  // console.log('powerDataSql->',powerDataSql)
  const powerDataPromise = db.runIotMgmtQuery("m202", powerDataSql, isPrev);

  // Query here for room_info_table s cooling_per_room for requested room id
  const roomInfoPromise = getRoomInfo();

  // @lucy
  const promiseDataArray = [
    officeCoolingLoadFlowRatePromise,
    officeCoolingLoadTempInPromise,
    officeCoolingLoadTempOutPromise,
    hotelCoolingLoadFlowRatePromise,
    hotelCoolingLoadTempInPromise,
    hotelCoolingLoadTempOutPromise,
    powerDataPromise,
    roomInfoPromise,
  ];
  return Promise.all(promiseDataArray)
    .then(async (dataArray) => {
      const officeCoolingLoadFlowRate = dataArray[0][0].map((v) => v.value);
      const officeCoolingLoadTempIn = dataArray[1][0].map((v) => v.value);
      const officeCoolingLoadTempOut = dataArray[2][0].map((v) => v.value);
      const hotelCoolingLoadFlowRate = dataArray[3][0].map((v) => v.value);
      const hotelCoolingLoadTempIn = dataArray[4][0].map((v) => v.value);
      const hotelCoolingLoadTempOut = dataArray[5][0].map((v) => v.value);
      const powerData = dataArray[6][0];
      const roomInfo = dataArray[7][0];

      const resultedArray = [];

      if (officeCoolingLoadFlowRate.length < 20 ||
        officeCoolingLoadTempIn.length < 20 ||
        officeCoolingLoadTempOut.length < 20 ||
        hotelCoolingLoadFlowRate.length < 20 ||
        hotelCoolingLoadTempIn.length < 20 ||
        hotelCoolingLoadTempOut.length < 20 ||
        powerData.length < 20
      ) {
        for (let index = 0; index < roomInfo.length; index++) { 
          const room = roomInfo[index];
          let prevDate = startDate;
          let curDate = dateFns.format(startDate, dateFormat)
          let tillDate = new Date(startDate);
          let countHour=0;
          tillDate = dateFnsZone.utcToZonedTime(tillDate, timezone);
          let maxDate = dateFns.setSeconds(dateFns.setMinutes(dateFns.setHours(new Date(tillDate), 00), 0), 0);
          let stDate = dateFnsZone.format(prevDate, dateFormat, { timeZone: timezone })
          maxDate = dateFnsZone.format(maxDate, dateFormat, { timeZone: timezone });
          let lossData = true;
          do {
            stDate = dateFns.subHours(new Date(stDate), 1)
            stDate = dateFnsZone.format(stDate, dateFormat, { timeZone: timezone })
            const previousResult = await db.getResultedData(stDate, room.room_no)
            countHour=++countHour;
            console.log(previousResult[0][0],stDate,countHour)
            if(previousResult[0][0] !==undefined){              
                  lossData=false;
                  const result1 = await db.saveResultedDataArray(previousResult[0][0], curDate);
                   if(result1[0]){
                    //  console.log("save previous data success",previousResult[0][0],room.room_no)
                    resultedArray.push(previousResult[0][0])                     
                   }
                 }
            else{
              lossData=true
            }          

          } while(maxDate < stDate  & lossData) //(maxDate < stDate & hasData)
        
          if(lossData){
            const resultedData = {
              roomNo: room.room_no,
              roomType: room.room_type,
              officeCoolingLoad:0,
              hotelCoolingLoad:0,
              coolingRequired:0,
              powerDataTotal:0,
              plantEfficiency:0,
              energyConsumption:0,
              startTs: curDate,
              endTs: dateFns.format(
                dateFns.subSeconds(currentDate, 1),
                dateFormat
              ),
              dataColor:'-',
            };
            const result = await db.saveResultedData(resultedData)
            if(result[0]){
              // console.log("save previous data success with zeros",room.room_no,curDate)
              resultedArray.push(resultedData)                     
            }
          }
        }
        return resultedArray
      }

      else {

        const officeCoolingLoadFlowRateMedian =
          officeCoolingLoadFlowRate.length / 2 === 0
            ? officeCoolingLoadFlowRate[
            parseInt(officeCoolingLoadFlowRate.length / 2)
            ]
            : (officeCoolingLoadFlowRate[
              parseInt(officeCoolingLoadFlowRate.length / 2)
            ] +
              officeCoolingLoadFlowRate[
              parseInt(officeCoolingLoadFlowRate.length / 2 + 1)
              ]) /
            2;
        const officeCoolingLoadTempInMedian =
          officeCoolingLoadTempIn.length / 2 === 0
            ? officeCoolingLoadTempIn[
            parseInt(officeCoolingLoadTempIn.length / 2)
            ]
            : (officeCoolingLoadTempIn[
              parseInt(officeCoolingLoadTempIn.length / 2)
            ] +
              officeCoolingLoadTempIn[
              parseInt(officeCoolingLoadTempIn.length / 2 + 1)
              ]) /
            2;
        const officeCoolingLoadTempOutMedian =
          officeCoolingLoadTempOut.length / 2 === 0
            ? officeCoolingLoadTempOut[
            parseInt(officeCoolingLoadTempOut.length / 2)
            ]
            : (officeCoolingLoadTempOut[
              parseInt(officeCoolingLoadTempOut.length / 2)
            ] +
              officeCoolingLoadTempOut[
              parseInt(officeCoolingLoadTempOut.length / 2 + 1)
              ]) /
            2;
        const hotelCoolingLoadFlowRateMedian =
          hotelCoolingLoadFlowRate.length / 2 === 0
            ? hotelCoolingLoadFlowRate[
            parseInt(hotelCoolingLoadFlowRate.length / 2)
            ]
            : (hotelCoolingLoadFlowRate[
              parseInt(hotelCoolingLoadFlowRate.length / 2)
            ] +
              hotelCoolingLoadFlowRate[
              parseInt(hotelCoolingLoadFlowRate.length / 2 + 1)
              ]) /
            2;
        const hotelCoolingLoadTempInMedian =
          hotelCoolingLoadTempIn.length / 2 === 0
            ? hotelCoolingLoadTempIn[parseInt(hotelCoolingLoadTempIn.length / 2)]
            : (hotelCoolingLoadTempIn[
              parseInt(hotelCoolingLoadTempIn.length / 2)
            ] +
              hotelCoolingLoadTempIn[
              parseInt(hotelCoolingLoadTempIn.length / 2 + 1)
              ]) /
            2;
        const hotelCoolingLoadTempOutMedian =
          hotelCoolingLoadTempOut.length / 2 === 0
            ? hotelCoolingLoadTempOut[
            parseInt(hotelCoolingLoadTempOut.length / 2)
            ]
            : (hotelCoolingLoadTempOut[
              parseInt(hotelCoolingLoadTempOut.length / 2)
            ] +
              hotelCoolingLoadTempOut[
              parseInt(hotelCoolingLoadTempOut.length / 2 + 1)
              ]) /
            2;

        const powerDataGroupIeee = powerData.reduce((r, c) => {
          const R = { ...r };
          if (!R[c.ieee]) R[c.ieee] = [];
          R[c.ieee].push(c.value);
          return R;
        }, {});
        const powerDataTotal = Object.values(powerDataGroupIeee)
          .map((v) => {
            const V = [...v];
            V.sort((left, right) => left - right);
            return V;
          })
          .map((v) =>
            v.length / 2 === 0
              ? v[parseInt(v.length / 2)]
              : (v[parseInt(v.length / 2)] + v[parseInt(v.length / 2 + 1)]) / 2
          )
          .reduce((r, c) => r + c / 1000, 0); ///1000

        const officeCoolingLoad =
          (4.2 *
            997 *
            officeCoolingLoadFlowRateMedian *
            (officeCoolingLoadTempInMedian - officeCoolingLoadTempOutMedian)) /
          (3600 * 3.51685);
        const hotelCoolingLoad =
          (4.2 *
            997 *
            hotelCoolingLoadFlowRateMedian *
            (hotelCoolingLoadTempInMedian - hotelCoolingLoadTempOutMedian)) /
          (3600 * 3.51685);
        const totalCoolingLoad = officeCoolingLoad + hotelCoolingLoad;
        const plantEfficiency = powerDataTotal / totalCoolingLoad; // should be around 0.6 // ask detail about efficiency calculation also coolingLoads

        // roomInfo.forEach((room) =>

        for (let indexx = 0; indexx < roomInfo.length; indexx++) {
          const room = roomInfo[indexx]
          const coolingRequired = room.cooling_required;

          const energyConsumption = plantEfficiency * coolingRequired * 1;

          const dataColor =
            energyConsumption <= 0.36
              ? "Green"
              : energyConsumption >= 0.36 && energyConsumption <= 0.4
                ? "Orange"
                : energyConsumption > 0.4
                  ? "Red"
                  : "-";
          //===================================================================== 
          // const resultedData = {
          //   roomNo: room.room_no,
          //   roomType: room.room_type,
          //   officeCoolingLoad,
          //   hotelCoolingLoad,
          //   // totalCoolingLoad,
          //   coolingRequired,
          //   powerDataTotal,
          //   plantEfficiency,
          //   energyConsumption,
          //   startTs: dateFns.format(startDate, dateFormat),
          //   endTs: dateFns.format(dateFns.subSeconds(currentDate, 1), dateFormat),
          //   dataColor,
          // };
          // resultedArray.push(resultedData);
          //  db.saveResultedData(resultedData);
          // ===============================================================
          // check nan value before save in database
          // if (
          //   isNaN(officeCoolingLoad) ||
          //   isNaN(hotelCoolingLoad) ||
          //   isNaN(powerDataTotal) ||
          //   isNaN(plantEfficiency) ||
          //   isNaN(energyConsumption)
          // ) {
          //   console.log('nanblock1-->', isNaN(officeCoolingLoad), isNaN(hotelCoolingLoad), isNaN(powerDataTotal), isNaN(plantEfficiency), isNaN(energyConsumption))
          //   const sDate = dateFns.subHours(currentDate, 2);
          //   const date = dateFnsZone.format(sDate, dateFormat, { timeZone: timezone })
          //   const nowDate = dateFns.format(startDate, dateFormat)
          //   //  const date = dateFns.subHours(sDate,1)
          //   const result = db.getResultedData(date, room.room_no)
          //     .then((data) => {
          //       if (data.length === 0) return null
          //       else {
          //         // return data[0][0];
          //         const result1 = db.saveResultedDataArray(data[0][0], nowDate)
          //           .then(data1 => {
          //             console.log('Success save with resulted-data with prev hour:');
          //             return data1[0];
          //           })
          //           .catch(error => {
          //             console.error("Error save resulted-data with prev hour: " + error.toString());
          //             return null;
          //           })
          //         return result1
          //       }
          //       // }
          //     })
          //     .catch((error) => {// throw error;
          //       console.error("Error get resulted-data at prev hour: " + error.toString())
          //       return null
          //     });
          //   resultedArray.push(result)
          // } else {

            const resultedData = {
              roomNo: room.room_no,
              roomType: room.room_type,
              officeCoolingLoad,
              hotelCoolingLoad,
              coolingRequired,
              powerDataTotal,
              plantEfficiency,
              energyConsumption,
              startTs: dateFns.format(startDate, dateFormat),
              endTs: dateFns.format(
                dateFns.subSeconds(currentDate, 1),
                dateFormat
              ),
              dataColor,
            };
            const result = db.saveResultedData(resultedData)
              .then(data => {
                console.log("succes", Object.keys(resultedData).length);
                return resultedData
              })
              .catch(error => {
                console.error("Error save room-info: " + error.toString())
                return null;
              })
            resultedArray.push(result)
          // }
        }
      }
      // each data will be saved in every hour as this method will only called at first second of every hour,// save resultedData as a row in db (historical data purpose)
      return resultedArray;
    })
    .catch((error) => {
      throw error;
    });
};
const getCommaSeparatedString = (arr, quote = true) => {
  return arr.reduce((r, c, i) => {
    const item = quote ? `'${c}'` : c;
    return `${r}${i == 0 ? "" : ", "}${item}`;
  }, "");
};

// ==========================================================================================================
//get room energy consumption by id ,startdate,enddate
const getRoomEnergyConsumption = (hotelId,no, startDate, endDate) => {
  console.log('service',hotelId)
  return db.oneHourEnergyConsumption(hotelId,no,startDate, endDate);
};

//get room carbon footprint by id,startdate,enddate
const getRoomCarbonFootPrint = async (hotelId,id, startDate, endDate) => {
  // const coefficient = await getCoefficient();
  return db
    .hourlyRoomEnergyConsumption(hotelId,id, startDate, endDate)
    .then((data) => {
      // const Coefficient = coefficient.reduce((r,c)=> { return r+c.coefficient},null) ;
      const totalEnergy = data[0].reduce((r, c) => r + c.energyConsumption, 0);
      const carbon = totalEnergy * 0.4;
      const offset = carbon * 1.43033;
      return { carbon, offset, unit: "SGD", totalEnergy };
    })
    .catch((error) => {
      console.log(error, "in carbon footprint calcul");
      throw error;
    });
};
// ====================================================================

//get coefficient
// const getCoefficient = () => {
//   return db
//     .getCoefficient()
//     .then((data) => {
//       return data[0];
//     })
//     .catch((error) => console.log(error, "in get coefficient"));
// };
const getRoomInfo = () => {
  return db
    .getRoomInfo()
    .then((data) => {
      return data;
    })
    .catch((error) => {
     throw error;
    });
};
// get room info by id
const getRoomInfoById = (room_id, hotel_id) => {
  return db.getRoomInfoById(room_id, hotel_id);
};
// get hotel-info service
const getHotelInfoData = () => {
  return db.getHotelInfo();
};

// room data not using currently
const getRoomData = (startDate, endDate, hotel_id, room_id) => {
  const promise1 = getRoomInfoById(room_id, hotel_id);
  const promise2 = getRoomEnergyConsumption(room_id, startDate, endDate);
  // const promise3 = getRoomCarbonFootPrint(room_id, startDate, endDate);
  return Promise.all([promise1, promise2])

    .then((values) => {
      // console.log(values[0][0], values[1][0], "---->V");
      const roomData = values[0][0];
      if (roomData.length > 0) {
        const room = roomData.map((v0) => {
          const r1 = values[2].map((v2) => ({
            room_no: v0.room_no,
            room_type: v0.room_type,
            /* room_area: v0.room_area,*/ room_height: v0.room_height_m,
            room_size: v0.room_size_m2,
            ave_temp: v0.ave_temp,
            hotel_id: v0.hotel_id,
            startDate: startDate,
            endDate: endDate,
            // carbon_value: v2.carbonFoodPrint,
            // total_energy: v2.total_energy,
          }));
          return r1;
        });
        return { room: room[0], energy: values[0][1] };
      } else {
        return [];
      }
    })
    .then((resultData) => {
      return resultData;
    })
    .catch((error) => {
      return error;
    });
};

module.exports = {
  oneHourScheduler,
  oneHourSchedulerAuto,
  getRoomInfoById,
  getRoomEnergyConsumption,
  getRoomCarbonFootPrint,
  getRoomData,
  getHotelInfoData,
};

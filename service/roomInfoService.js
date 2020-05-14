const db = require("../db/carbonoffset_db");
const moment = require('moment')
const { sub, set, add, parseISO, format, isBefore } = require("date-fns");
const dateFns = require("date-fns")
var subHours = require('date-fns/subHours')

// median
const isMedian = (values) => {
  if (values.length === 0) return 0;
  let arr = values.sort((a, b) => {
    return a - b;
  });
  var half = Math.floor(values.length / 2);
  if (values.length % 2) return arr[half];
  return (arr[half - 1] + arr[half]) / 2.0;
};

// developed by @nayhtet
const oneHourScheduler = () => {
  // console.log('onehourschedular start',dateFns.format(new Date(),'yyyy-MM-dd HH:mm:ss'))
   const currentDate = new Date(2020, 3, 28, 1, 0, 0) 
  // const currentDate =  new Date()  new Date(2020, 4, 13, 1, 0, 0)
  const startDate = dateFns.subHours(currentDate, 1)
  const dateFormat = "yyyy-MM-dd HH:mm:ss"
  console.log("startDate: ", startDate, 'currentDate=>',currentDate, dateFns.format(startDate, dateFormat))
 
  const power202 = ["ppssbms0013","ppssbms0014","ppssbms0015","ppssbms0016","ppssbms0017","ppssbms0018","ppssbms0019","ppssbms001a","ppssbms001b","ppssbms001c","ppssbms001d"]
  const temp202 = ["ppssbms001f"]
  const flow202 = ["ppssbms001d","ppssbms0023"]
  const temp114 = ["ppssbms0024","ppssbms0025"]

  // Office cooling
  const officeCoolingLoadFlowRateSql = `select flowRate as value, ts from ultrasonicFlow2 where ieee in ('${flow202[1]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and flowRate is not null and flowRate>0 order by flowRate asc`
  const officeCoolingLoadFlowRatePromise = db.runIotMgmtQuery("m202", officeCoolingLoadFlowRateSql)
  const officeCoolingLoadTempInSql = `select temp1 as value, ts from dTemperature where ieee in ('${temp114[1]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and temp1 is not null and temp1>0 order by temp1 asc`
  const officeCoolingLoadTempInPromise = db.runIotMgmtQuery("m114", officeCoolingLoadTempInSql)
  const officeCoolingLoadTempOutSql = `select temp1 as value, ts from dTemperature where ieee in ('${temp114[0]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and temp1 is not null and temp1>0 order by temp1 asc`
  const officeCoolingLoadTempOutPromise = db.runIotMgmtQuery("m114", officeCoolingLoadTempOutSql)
  // Office cooling
  const hotelCoolingLoadFlowRateSql = `select flowRate as value, ts from ultrasonicFlow2 where ieee in ('${flow202[1]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and flowRate is not null and flowRate>0 order by flowRate asc`
  const hotelCoolingLoadFlowRatePromise = db.runIotMgmtQuery("m202", hotelCoolingLoadFlowRateSql)
  const hotelCoolingLoadTempInSql = `select temp2 as value, ts from dTemperature where ieee in ('${temp202[0]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and temp2 is not null and temp2>0 order by temp2 asc`
  const hotelCoolingLoadTempInPromise = db.runIotMgmtQuery("m114", hotelCoolingLoadTempInSql)
  const hotelCoolingLoadTempOutSql = `select temp1 as value, ts from dTemperature where ieee in ('${temp202[0]}') and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and temp1 is not null and temp1>0 order by temp1 asc`
  const hotelCoolingLoadTempOutPromise = db.runIotMgmtQuery("m114", hotelCoolingLoadTempOutSql)

  const powerDataSql = `select ch1Watt as value, ieee, ts from pm where ieee in (${getCommaSeparatedString(power202)}) and ts between '${dateFns.format(startDate, dateFormat)}' and '${dateFns.format(currentDate, dateFormat)}' and ch1Watt is not null and ch1Watt>0 order by value asc`
  const powerDataPromise = db.runIotMgmtQuery("m202", powerDataSql)

  // Query here for room_info_table s cooling_per_room for requested room id
  const roomInfoPromise = getRoomInfo();
  
  // @lucy

  // take one values for test
  // const coolingRequiredForRoom =  roomInfoValue[0].map(v=>{
  //   return {
  //     cooling_required:v.cooling_required,
  //     room_type:v.room_type,
  //     room_no:v.room_no
  //   }
  // })

  const promiseDataArray = [ 
    officeCoolingLoadFlowRatePromise,
    officeCoolingLoadTempInPromise,
    officeCoolingLoadTempOutPromise,
    hotelCoolingLoadFlowRatePromise,
    hotelCoolingLoadTempInPromise,
    hotelCoolingLoadTempOutPromise,
    powerDataPromise,
    roomInfoPromise,
  ]
  return Promise.all(promiseDataArray)
  .then(dataArray => {
    const officeCoolingLoadFlowRate = dataArray[0][0].map(v => v.value)
    const officeCoolingLoadTempIn = dataArray[1][0].map(v => v.value)
    const officeCoolingLoadTempOut = dataArray[2][0].map(v => v.value)
    const hotelCoolingLoadFlowRate = dataArray[3][0].map(v => v.value)
    const hotelCoolingLoadTempIn = dataArray[4][0].map(v => v.value)
    const hotelCoolingLoadTempOut = dataArray[5][0].map(v => v.value)
    const powerData = dataArray[6][0]
    const roomInfo = dataArray[7][0]
    // return ({
    //   hoteltemp: [dataArray[4][0].length, hotelCoolingLoadTempOut.length, hotelCoolingLoadTempInSql],
    //   dataArray,
    //   officeCoolingLoadFlowRate, 
    //   officeCoolingLoadTempIn, 
    //   officeCoolingLoadTempOut, 
    //   hotelCoolingLoadFlowRate, 
    //   hotelCoolingLoadTempIn: dataArray[4][0], 
    //   hotelCoolingLoadTempOut, 
    //   powerData,
    // })

    const officeCoolingLoadFlowRateMedian = officeCoolingLoadFlowRate.length/2 === 0 
      ? officeCoolingLoadFlowRate[parseInt(officeCoolingLoadFlowRate.length/2)] 
      : (officeCoolingLoadFlowRate[parseInt(officeCoolingLoadFlowRate.length/2)]+officeCoolingLoadFlowRate[parseInt(officeCoolingLoadFlowRate.length/2+1)])/2
    const officeCoolingLoadTempInMedian = officeCoolingLoadTempIn.length/2 === 0 
      ? officeCoolingLoadTempIn[parseInt(officeCoolingLoadTempIn.length/2)] 
      : (officeCoolingLoadTempIn[parseInt(officeCoolingLoadTempIn.length/2)]+officeCoolingLoadTempIn[parseInt(officeCoolingLoadTempIn.length/2+1)])/2
    const officeCoolingLoadTempOutMedian = officeCoolingLoadTempOut.length/2 === 0 
      ? officeCoolingLoadTempOut[parseInt(officeCoolingLoadTempOut.length/2)] 
      : (officeCoolingLoadTempOut[parseInt(officeCoolingLoadTempOut.length/2)]+officeCoolingLoadTempOut[parseInt(officeCoolingLoadTempOut.length/2+1)])/2
    const hotelCoolingLoadFlowRateMedian = hotelCoolingLoadFlowRate.length/2 === 0 
      ? hotelCoolingLoadFlowRate[parseInt(hotelCoolingLoadFlowRate.length/2)] 
      : (hotelCoolingLoadFlowRate[parseInt(hotelCoolingLoadFlowRate.length/2)]+hotelCoolingLoadFlowRate[parseInt(hotelCoolingLoadFlowRate.length/2+1)])/2
    const hotelCoolingLoadTempInMedian = hotelCoolingLoadTempIn.length/2 === 0 
      ? hotelCoolingLoadTempIn[parseInt(hotelCoolingLoadTempIn.length/2)] 
      : (hotelCoolingLoadTempIn[parseInt(hotelCoolingLoadTempIn.length/2)]+hotelCoolingLoadTempIn[parseInt(hotelCoolingLoadTempIn.length/2+1)])/2
    const hotelCoolingLoadTempOutMedian = hotelCoolingLoadTempOut.length/2 === 0 
      ? hotelCoolingLoadTempOut[parseInt(hotelCoolingLoadTempOut.length/2)] 
      : (hotelCoolingLoadTempOut[parseInt(hotelCoolingLoadTempOut.length/2)]+hotelCoolingLoadTempOut[parseInt(hotelCoolingLoadTempOut.length/2+1)])/2
    
    const powerDataGroupIeee = powerData.reduce((r,c) => {
      const R = {...r}
      if(!R[c.ieee]) R[c.ieee] = []
      R[c.ieee].push(c.value)
      return R
    }, {})
    const powerDataTotal = Object.values(powerDataGroupIeee).map(v => {
      const V = [...v]
      V.sort((left,right) => left-right)
      return V
    })
    .map(v => v.length/2===0 ? v[parseInt(v.length/2)] : (v[parseInt(v.length/2)]+v[parseInt(v.length/2+1)])/2)
    .reduce((r,c) => r+(c/1000),0)///1000
    
    const officeCoolingLoad = (4.2 * 997 * officeCoolingLoadFlowRateMedian * (officeCoolingLoadTempInMedian-officeCoolingLoadTempOutMedian)) / (3600 * 3.51685)
    const hotelCoolingLoad = 197.91875258/*(4.2 * 997 * hotelCoolingLoadFlowRateMedian * (hotelCoolingLoadTempInMedian-hotelCoolingLoadTempOutMedian)) / (3600 * 3.51685)*/
    const totalCoolingLoad = officeCoolingLoad + hotelCoolingLoad
    const plantEfficiency = powerDataTotal/totalCoolingLoad // should be around 0.6 // ask detail about efficiency calculation also coolingLoads
    
    const resultedArray = []
    roomInfo.forEach(room =>{
      const coolingRequired = room.cooling_required

      const energyConsumption = plantEfficiency * coolingRequired * 1
      
      const dataColor = energyConsumption <= 0.360 
        ? "Green"
        : energyConsumption >= 0.360 && energyConsumption <=0.40
          ? "Orange"
          : energyConsumption > 0.40
            ? "Red"
              : "-"

      const resultedData = {
        roomNo: room.room_no,
        roomType: room.room_type,
        officeCoolingLoad, 
        hotelCoolingLoad, 
        totalCoolingLoad, 
        coolingRequired,
        powerDataTotal, 
        plantEfficiency, 
        energyConsumption,
        startTs: dateFns.format(startDate, dateFormat),
        endTs: dateFns.format(currentDate, dateFormat),
        dataColor      
      }

      resultedArray.push(resultedData)
      db.saveResultedData(resultedData)
    })

    // save resultedData as a row in db (historical data purpose)
    // each data will be saved in every hour as this method will only called at first second of every hour
    return resultedArray

  })
  .catch(error=> {
    throw error
  })
  // .then(Rdata=>{
  //   return db.saveResultedData(Rdata)
  //   .then(d=>console.log('save Resulted-data success'))
  //   .catch(error=>{ throw error})
  // })
  

}
const getCommaSeparatedString = (arr, quote=true) => {
  return arr.reduce((r,c, i) => {
      const item = quote ? `'${c}'` : c
      return `${r}${i==0 ? '' : ', '}${item}`
  }, "")
}



// for one hour scheduler
const oneHourScheduler_old = async () => {
  // const time = format(sub(new Date('2020-01-01 00:02:00'), { minutes: 02, seconds: 01 }), ('yyyy-MM-dd HH:mm:ss'))
  const time = format(  sub(Date.now(), { minutes: 01, seconds: 00 }),"yyyy-MM-dd HH:mm:ss" );
// const time = format(Date.now(), "yyyy-MM-dd HH:mm:ss");
// const time = moment(new Date()).subtract(1, 'mins') //.format('MMMM Do YYYY, h:mm:ss a')
  console.log("onehour start",time);
  const roomInfoValue = await getRoomInfo();
  return getMedianEfficiency(time)
    .then((efficiency) => {
        // console.log('raw is=>',efficiency[0]);
      return efficiency[0].map((e) => {
        const timeTo = format( add(new Date(e.ts), { seconds: 59 }), "yyyy-MM-dd HH:mm"  );
        let timeFrom = format(sub(new Date(timeTo), { hours: 1 }),"yyyy-MM-dd HH:mm"  );
        let dataArr = [];
        while (isBefore(parseISO(timeFrom), parseISO(timeTo))) {
          const result = roomInfoValue[0].map((room) => {
            // const oneHourValue = room.cooling_per_room * e.efficiency * 1
            const oneHourValue =(room.room_size_m2 / room.cooling_required) * e.efficiency * 1;
            // console.log(parseFloat(oneHourValue).toFixed(3),'1hour')
            return {
            kWH: oneHourValue.toFixed(3),
            roomType: room.room_type,
            ts: timeFrom,
            };
          });
          dataArr.push({ time: timeFrom, data: result });
          timeFrom = format(add(new Date(timeFrom), { hours: 1 }),"yyyy-MM-dd HH:mm" );
        }
        return dataArr;
      });
    })
    .then((resultedData) => {
      // error-handle
      return resultedData.length == 0
        ? console.log("NoResultedData in onehourService")
        : resultedData[0].map((d) => {
            return d.data.map((c) => {
              return db
                .saveOneHourCalculatedData(c.ts, c.roomType, c.kWH)
                .then((d) => console.log("save one hour energy,successfully"))
                .catch((error) => console.log('err is=>',error));
            });
          });
    })
    .catch((error) => console.log(error));
};

// ==========================================================================================================
//get room energy consumption by id ,startdate,enddate
const getRoomEnergyConsumption = (id, startDate, endDate) => {
    return db
      .hourlyRoomEnergyConsumption(id, startDate, endDate)
      .then((data) => {
        return data[0].length > 0
          ? data[0].map((d) => ({
              room_no: d.room_no,
              ts: format(new Date(d.ts), "yyyy-MM-dd HH:mm"),
              kWh: d.kWh.toFixed(3),
              room_area: d.room_area,
              cooling_required: d.cooling,
              data: d,
            }))
          : [];
      })
      .catch((error) => {
        console.log("energy calculation", error);
        return error;
      });
  };
  
  //get room carbon footprint by id,startdate,enddate
  const getRoomCarbonFootPrint = async (id, startDate, endDate) => {
    const coefficient = await getCoefficient();
    return db
      .hourlyRoomEnergyConsumption(id, startDate, endDate)
      .then((data) => {
        const dataResult = data[0].reduce(
          (r, c) => {
            return { totalkWh: r.totalkWh + c.kWh, room_no: c.room_no };
          },
          { totalkWh: 0, room_no: null }
        );
        return dataResult;
      })
      .then((dataResult) => {
        const result = coefficient.map((coe) => {
          return {
            room_no: dataResult.room_no,
            total_energy: dataResult.totalkWh,
            carbonFootPrint: parseFloat(
              (coe.coefficient * dataResult.totalkWh).toFixed(3)
            ),
            offset: parseFloat(coe.coefficient * dataResult.totalkWh) * 1.43033,
          };
        });
        return result;
      })
      .catch((error) => {
        console.log(error, "in carbon footprint calcul");
        return error;
      });
  };
// ====================================================================
// @lucy new
const Chilled_water_flow = (startDate, endDate) => {
  return db
    .chilled_water_flow(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Chilled_water_flow_office = (startDate, endDate) => {
  return db
    .chilled_water_flow_office(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Hotel_plant_cooling_temp = (startDate, endDate) => {
  return db
    .hotel_plant_cooling_temp(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Office_cooling_0025 = (startDate, endDate) => {
  return db
    .office_temp_0025(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Office_cooling_0024 = (startDate, endDate) => {
  return db
    .office_temp_0024(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Ch1 = (startDate, endDate) => {
  return db
    .ch1(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Ch2 = (startDate, endDate) => {
  return db
    .ch2(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Ch3 = (startDate, endDate) => {
  return db
    .ch3(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Eva_water_pump1 = (startDate, endDate) => {
  return db
    .eva_water_pump1(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Eva_water_pump2 = (startDate, endDate) => {
  return db
    .eva_water_pump2(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Eva_water_pump3 = (startDate, endDate) => {
  return db
    .eva_water_pump3(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Con_water_pump1 = (startDate, endDate) => {
  return db
    .con_water_pump1(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Con_water_pump2 = (startDate, endDate) => {
  return db
    .con_water_pump2(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Con_water_pump3 = (startDate, endDate) => {
  return db
    .con_water_pump3(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
const Cooling_tower = (startDate, endDate) => {
  return db
    .cooling_tower(startDate, endDate)
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log("Raw error", error));
};
// ================================================================================

//get coefficient
const getCoefficient = () => {
  return db
    .getCoefficient()
    .then((data) => {
      return data[0];
    })
    .catch((error) => console.log(error, "in get coefficient"));
};
const getRoomInfo = () => {
  return db
    .getRoomInfo()
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.log(error, "in get roominfo");
      return error;
    });
};
// get room info by id
const getRoomInfoById = (room_id, hotel_id) => {
  return db.getRoomInfoById(room_id, hotel_id);
};

const getMedianEfficiency = (ts) => {
  return db.getEFficiencyMedian(ts)
};

// room data
const getRoomData = (startDate, endDate, hotel_id, room_id) => {
  const promise1 = getRoomInfoById(room_id, hotel_id);
  const promise2 = getRoomEnergyConsumption(room_id, startDate, endDate);
  const promise3 = getRoomCarbonFootPrint(room_id, startDate, endDate);
  return Promise.all([promise1, promise2, promise3])
    .then((values) => {
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
            carbon_value: v2.carbonFoodPrint,
            total_energy: v2.total_energy,
          }));
          return r1;
        });
        return { room: room[0], energy: values[1] };
      } else {
        return [];
      }
    })
    .then((resultData) => {
      return resultData;
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};
// get hotel-info service
const getHotelInfoData = () => {
  return db.getHotelInfo();
};


module.exports = {
  // fourHourScheduler,
  oneHourScheduler,
  oneHourScheduler_old,
  getRoomInfoById,
  getRoomEnergyConsumption,
  getRoomCarbonFootPrint,
  getRoomData,
  getHotelInfoData,
};


// four hour scheduler
// const fourHourScheduler = () => {
//   console.log('four hourstart')
//   //  const endDate = format(parseISO("2020-01-01 03:59:59"), "yyyy-MM-dd HH:mm:ss")
//   const endDate = format(Date.now(), "yyyy-MM-dd HH:mm:ss");
//   // const endDate =  format(subMinutes(Date.now(),1),"yyyy-MM-dd HH:mm")
//   //  const startDate = format(sub(new Date(endDate), { hours: 3, minutes: 59, seconds: 59 }), "yyyy-MM-dd HH:mm:ss")
//   const startDate = format(sub(new Date(endDate), { hours: 00, minutes: 59, seconds: 59 }), "yyyy-MM-dd HH:mm:ss" )
//   // ======================================================================
//   const chilled_water_flow = Chilled_water_flow(startDate, endDate);
//   const chilled_water_flow_office = Chilled_water_flow_office(startDate,endDate);
//   const hotel_plant_cooling_temp = Hotel_plant_cooling_temp(startDate, endDate);
//   const ch1 = Ch1(startDate, endDate);
//   const ch2 = Ch2(startDate, endDate);
//   const ch3 = Ch3(startDate, endDate);
//   const eva_water_pump1 = Eva_water_pump1(startDate, endDate);
//   const eva_water_pump2 = Eva_water_pump2(startDate, endDate);
//   const eva_water_pump3 = Eva_water_pump3(startDate, endDate);
//   const con_water_pump1 = Con_water_pump1(startDate, endDate);
//   const con_water_pump2 = Con_water_pump2(startDate, endDate);
//   const con_water_pump3 = Con_water_pump3(startDate, endDate);
//   const cooling_tower = Cooling_tower(startDate, endDate);
//   const office_cooling_temp_0025 = Office_cooling_0025(startDate, endDate);
//   const office_cooling_temp_0024 = Office_cooling_0024(startDate, endDate);
//   Promise.all([
//     chilled_water_flow,
//     chilled_water_flow_office,
//     hotel_plant_cooling_temp,
//     ch1,
//     ch2,
//     ch3,
//     eva_water_pump1,
//     eva_water_pump2,
//     eva_water_pump3,
//     con_water_pump1,
//     con_water_pump2,
//     con_water_pump3,
//     cooling_tower,
//     office_cooling_temp_0025,
//     office_cooling_temp_0024,
//   ])
//     .then((values) => {
//       const hotel_result = values[0].map((c) => {
//         const temp = values[2]
//           .filter((v1) => v1.ts === c.ts)
//           .map((result) => result.temp);
//         const flowRate = c.flowRate;
//         const hotel_cooling_load =
//           (4.2 * 997 * flowRate * temp) / (3600 * 3.51685);
//         return hotel_cooling_load;
//       });
//       const office_result = values[1].map((c) => {
//         const temp25 = values[13]
//           .filter((v1) => v1.ts === c.ts)
//           .map((result) => result.temp1);
//         const temp24 = values[14]
//           .filter((v2) => v2.ts === c.ts)
//           .map((result) => result.temp1);
//         const office_cooling_load =
//           (4.2 * 997 * c.flowRate * [temp25 - temp24]) / (3600 * 3.51685);
//         return office_cooling_load;
//       });
//       const power = values[3].map((c) => {
//         const ch1 = c.ch1Watt;
//         const ch2 = values[4]
//            .filter((v1) => c.ts === v1.ts)
//           .map((r1) =>r1.ch1Watt );
//         const ch3 = values[5]
//           .filter((v2) => c.ts === v2.ts)
//           .map((r2) => r2.ch1Watt);
//         const evaWaterPump1 = values[6]
//           .filter((v3) => c.ts === v3.ts)
//           .map((r3) => r3.ch1Watt);
//         const evaWaterPump2 = values[7]
//           .filter((v4) => c.ts === v4.ts)
//           .map((r4) => r4.ch1Watt);
//         const evaWaterPump3 = values[8]
//           .filter((v5) => c.ts === v5.ts)
//           .map((r5) => r5.ch1Watt);
//         const conWaterPump1 = values[9]
//           .filter((v6) => c.ts === v6.ts)
//           .map((r6) => r6.ch1Watt);
//         const conWaterPump2 = values[10]
//           .filter((v7) => c.ts === v7.ts)
//           .map((r7) => r7.ch1Watt);
//         const conWaterPump3 = values[11]
//           .filter((v8) => c.ts === v8.ts)
//           .map((r8) => r8.ch1Watt);
//         const coolingTower = values[12]
//           .filter((v9) => c.ts === v9.ts)
//           .map((r9) => r9.ch1Watt);
//         const power =
//           (ch1 +
//             ch2 +
//             ch3 +
//             evaWaterPump1 +
//             evaWaterPump2 +
//             evaWaterPump3 +
//             conWaterPump1 +
//             conWaterPump2 +
//             conWaterPump3 +
//             coolingTower) /
//           1000;
//         return power;
//       });
     
//       const total_power = power.reduce((a, b) => a+ b, 0);
//       var temp = office_result.map(function (num, idx) {
//         return num + hotel_result[idx];
//       });
//       const medianTemp = isMedian(temp);
//       const efficiency = total_power / medianTemp;
//       console.log(efficiency,'isefficiency',typeof(efficiency),medianTemp,total_power)
//       //   console.log(efficiency.toFixed(2), typeof efficiency);
//       return efficiency;
//     })
//     .then((efficiency) => {
//         // console.log('endDate is=>',efficiency.toFixed(3));
//       const efficiencyMedian = efficiency === 0 ? 0 : efficiency.toFixed(3);
//       return db
//         .saveFourHourCalculatedData(efficiencyMedian, endDate)
//         .then((d) => { return d[0];})
//         .catch((error) => console.log("save error", error));
//     })
//     // .then((data) => {
//     //     return db.loadMedianEfficiency()
//     //     .then(d=> { console.log('saveMedianEfficiency')})
//     //     .catch(error=>console.log(error))
//     // })
//     .catch((error) => console.log("calculation error", error));
// };

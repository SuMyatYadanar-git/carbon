const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { format } = require('date-fns')
const cors = require("cors");
const auth = require('basic-auth')
const CronJob = require("cron").CronJob;
const db = require("./db/carbonoffset_db");
const response = require("./config/response");

const service = require("./service/roomInfoService");
const router = require("./route/index");
// const router = require('./route/roomRoute.js')


const app = express();
const port = 5055;

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, *POST*, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(router);

app.get('/hi', (req, res) => {
  res.send('hello carbon server api')
})
app.get("/one-hour-manual", (req, res) => {
  const endDateQuery = req.query.endDate
  if (!endDateQuery) return res.status(400).json({ error: "Provide endDate for manual." })
  const endDate = Date.parse(endDateQuery)
  // const timezone = "Asia/Singapore";
  // const endDate = dateFnsZone.utcToZonedTime(endDateObj, timezone);
  service
    .oneHourScheduler(endDate)
    .then((data) => {
      Promise.all(data)
        .then(resultedData => {
          if (resultedData.filter(v => !v).length > 0) {
            res.json({ error: "Not Success", error: error.toString() })
          }
          else res.status(200).json(resultedData)
        })
        .catch(error => res.status(400).json({ error: error.toString() }))

    })
    .catch((error) => res.status(400).json({ error: error.toString() }));
});

// 0 0 */01 * * *
// run every one hour
const job0 = new CronJob("0 10 * * * *", () => {
  return db.pingAllDBs()
});
const job1 = new CronJob("0 0 */1 * * *", service.oneHourSchedulerAuto);

app.use((req, res, next) => {
  return res.status(404).send(response({
    success:false,
    status: 404,
    error: 'Not found'
  }))
})

app.use(async (err, req, res, next) => {
  if (err) {
    console.log(err,': iserr-middleware ')
    const errors = await db.getErrorCodes(err.error.errno ===  undefined ? -1012 :err.error.errno);
    let dbError = errors[0][0];
    return res.status(err.status).send(response({
      success: false,
      error: err.error.errno?err.error.errno : '-1012',
      message: dbError.error_message
    }))
  }
  else {
    next();
  }
})

app.listen(port, (err) => {
  if (err) {
    console.log("server not responding", err);
  } else {
    console.log(`server up and running at http://localhost:${port} at ${format(new Date(), 'yyyy-MM-dd HH:mm:ss')}`);
    job0.start();
    job1.start();
  }

});



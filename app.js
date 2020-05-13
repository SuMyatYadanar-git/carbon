const express = require('express')
const bodyParser= require('body-parser')
const morgan = require("morgan");
const cors = require("cors");
const  CronJob = require('cron').CronJob

const service= require('./service/roomInfoService')
const router = require('./route/index')
const error_code = require('./error.js')
// const router = require('./route/roomRoute.js')

const app=express()
const port = 5000
const hostname="localhost"  // http://sample.evercomm.com
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, *POST*, PUT, DELETE'); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(morgan("dev"));
app.use(router)

app.use((req,res,next)=>{
    const error = new Error('Not found!')
    error.status =404
    next(error)
  })
  app.use((error,req,res,next)=>{
    error.status !== 404?
    res.status(500).json({success:false,error:-1003,})
    :
    res.status(404).json({success:false,error:-1002,})
  })


// const job1 = new CronJob('0 */01 * * * *', service.fourHourScheduler)0 0 */01 * * *
// const job2=new CronJob('0 */01 * * * *', service.oneHourScheduler)

const job1 = new CronJob('0 */1 * * *', service.fourHourScheduler)
const job2=new CronJob('0 */1 * * *', service.oneHourScheduler)
// const job1 = new CronJob('* */01 * * *', service.fourHourScheduler)
// const job2=new CronJob('* */01 * * *', service.oneHourScheduler)
app.listen(port,hostname,(err)=>{
    if(err){
        console.log("server not responding",err)
    }else
    console.log(`server up and running at http://localhost:${port} `)
       job1.start()
       job2.start()
    })
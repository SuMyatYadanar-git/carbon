const router = require('express').Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/carbonoffset_db')

const guestDetailController = require('../controller/guestDetailController')

// http://localhost:5000/reports/guest-detail post
// https://sample.evercomm.com/reports/guest-detail
//  "firstName":"lucy",
//   "lastName":"one",
//   "roomNumber":"301",
//   "checkIn":"2020-04-01 12:00",
//   "checkOut":"2020-04-06 12:00"
// .matches('/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)
router.post('/guest-detail',[
    check('firstName').notEmpty().trim(),
    check('lastName').notEmpty().trim(),
    check('roomNumber').notEmpty().trim().isNumeric(),
    check('checkIn').isISO8601('yyyy-mm-dd').withMessage('please enter valid-date,2020-01-01'),
    check('checkOut').isISO8601('yyyy-mm-dd').withMessage('please enter valid-date,2020-01-02'),
],guestDetailController.postGuestDetail)

 // http://localhost:5000/reports/newsletter post
//  https://sample.evercomm.com/reports/newsletter
// "email":"lucy1@gmail.com"
router.post('/newsletter',[
    check('email').isEmail().exists().trim()
    .withMessage('Email is already exists!!!')
],guestDetailController.newsLetter)

 // http://localhost:5000/reports/user-feedback post
router.post('/user-feedback',[
    // ('^([01]?[0-9]|2[0-3]):[0-5][0-9]$'))
    check('hours').matches(new RegExp('^([01]?[0-9]|2[0-3]):[0-5][0-9]$')).withMessage('invalid value!'),
    check('room_temp_level').trim(),
    check('hotel_temp_level').trim()
],guestDetailController.postUserFeedback)

module.exports=router
const router = require('express').Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/carbonoffset_db')

const guestDetailController = require('../controller/guestDetailController')

// http://localhost:5000/reports/guest-detail post
// https://sample.evercomm.com/reports/guest-detail
//  "firstName":"lucy",
//   "lastName":"one",
//   "roomNumber":"301",
//   "checkIn":"2020-05-10 10:00:00",
//   "checkOut":"2020-05-13 18:00:00"
// .matches('/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/)
router.post('/guest-detail',[
    check('first_name').notEmpty().trim(),
    check('last_name').notEmpty().trim(),
    check('room_no').notEmpty().trim().isNumeric(),
    check('check_in').trim().notEmpty().isISO8601().toDate().withMessage('checkIn must be in correct format YYYY-mm-dd 00:00:00'),
    check('check_out').trim().notEmpty().isISO8601().toDate().withMessage('checkOut must be in correct format YYYY-mm-dd 00:00:00'),
],guestDetailController.postGuestDetail)

 // http://localhost:5000/reports/newsletter post
//  https://sample.evercomm.com/reports/newsletter
// "email":"lucy1@gmail.com"
router.post('/newsletter',[
    check('email').isEmail().exists().trim()
    .withMessage('Email is already exists!!!')
],guestDetailController.newsLetter)

// http://localhost:5055/reports/guest-info?roomNo=301
router.get('/guest-info',guestDetailController.getGuestInfo)

 // http://localhost:5000/reports/user-feedback post
//  {
//     "hours": " 05:28:00",
//     "room_temp_level": "normal" ,
//     "hotel_temp_level":"cold" ,
//     "guest_id":"1"
//   }
router.post('/user-feedback',[
     check('hours').trim().notEmpty().isNumeric(),
    check('room_temp_level').notEmpty().trim(),
    check('hotel_temp_level').notEmpty().trim(),
    check('guest_id').notEmpty().isNumeric().trim().withMessage('Guestid must be integer')
],guestDetailController.postUserFeedback)

module.exports=router
const router = require('express').Router();
const { check, validationResult } = require('express-validator');

const db = require('../db/carbonoffset_db')

const guestDetailController = require('../controller/guestDetailController')

// http://localhost:5000/reports/guest-detail post
// https://sample.evercomm.com/reports/guest-detail
router.post('/guest-detail',[
    check('first_name').notEmpty().trim(),
    check('last_name').notEmpty().trim(),
    check('room_no').notEmpty().trim().isNumeric(),
    check('check_in').trim().notEmpty().isISO8601().toDate().withMessage('checkIn must be in correct format YYYY-mm-dd 00:00:00'),
    check('check_out').trim().notEmpty().isISO8601().toDate().withMessage('checkOut must be in correct format YYYY-mm-dd 00:00:00'),
    check('hotel_id').notEmpty().notEmpty().trim().isNumeric()
],guestDetailController.postGuestDetail)

 // http://localhost:5000/reports/newsletter post
//  https://sample.evercomm.com/reports/newsletter
// "email":"lucy1@gmail.com"
router.post('/newsletter',[
    check('email').isEmail().exists().trim()
    .withMessage('Email is already exists!!!'),
    check('hotel_id').notEmpty().trim().isNumeric(),
    //  check('room_no').trim().isNumeric()
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
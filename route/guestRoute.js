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
    check('check_in').trim().isISO8601().toDate().withMessage('checkIn must be in correct format YYYY-mm-dd 00:00:00'),
    check('check_out').trim().isISO8601().toDate().withMessage('checkOut must be in correct format YYYY-mm-dd 00:00:00'),
],guestDetailController.postGuestDetail)

 // http://localhost:5000/reports/newsletter post
//  https://sample.evercomm.com/reports/newsletter
router.post('/newsletter',[
    check('email').isEmail().exists().trim()
    .withMessage('Email is already exists!!!')
],guestDetailController.newsLetter)

// http://localhost:5055/reports/guest-info?roomNo=301
router.get('/guest-info',guestDetailController.getGuestInfo)

 // http://localhost:5000/reports/user-feedback post
router.post('/user-feedback',[
     check('hours').trim().isISO8601().toDate()
    .withMessage('hours must be in correct format YYYY-mm-dd 00:00:00'),
    check('room_temp_level').trim(),
    check('hotel_temp_level').trim(),
    check('guest_id').isNumeric().trim().withMessage('Guestid must be integer')
],guestDetailController.postUserFeedback)

module.exports=router
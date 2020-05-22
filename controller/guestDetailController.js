const { sub, set, add, parseISO, format, isBefore } = require("date-fns");
var dateFns = require('date-fns')
const dateFnsZone = require("date-fns-tz");
const { validationResult } = require("express-validator");
const error_code = require("../config/error");
const {
  postGuestDetailService,
  getGuestService,
  newsLetterService,
  getNewsletter,
  postUserFeedbackService,
  getGuestInfoDataService,
} = require("../service/guestService");
const response = require("../config/response");
const msgInfo = require("../config/msg");

const postGuestDetail = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        response({
          success: false,
          error: -1005,
          message: errors.array(),
        })
      );
    }
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const roomNumber = req.body.room_no;
    const checkInDate = format(new Date(req.body.check_in), "yyyy-MM-dd HH:mm:ss");
    const checkOutDate = format(new Date(req.body.check_out), "yyyy-MM-dd HH:mm:ss")  //Date.parse(req.body.checkOut) 
    // // format(
    //   new Date(req.body.checkOut),
    //   "yyyy-MM-dd HH:mm:ss"
    // );
    const checkGuestInfo = await getGuestInfoDataService()
    const filter = checkGuestInfo[0].filter((v) => {
      return v.first_name == firstName &&
        v.last_name == lastName &&
        v.room_no == roomNumber &&
        dateFns.compareAsc(Date.parse(req.body.check_in), Date.parse(v.checkin_datetime)) === 0 &&
        dateFns.compareAsc(Date.parse(req.body.check_out), Date.parse(v.checkout_datetime)) === 0
    })
    if (filter.length === 0) {
      return postGuestDetailService(
        firstName,
        lastName,
        roomNumber,
        checkInDate,
        checkOutDate
      )
        .then((data) => {
          const guest_id = data[0].insertId
          return res.status(201).json(
            response({
              message: `Guest info inserted successfully with guest id =${guest_id}`,
              payload: { guest_id }
            })
          );
        })
        .catch((error) => {

          return next({ status: 500, error:error })
          // return res.status(500).json(response({
          //   success: false,
          //   error: error.code ? error.errno : -1012,
          //   message: error.code ? error_code[error.errno] : error_code[-1012]
          // }))
        });
    } else {

      return next({ status: 409, error: { errno: -1006 } })
      // return res.status(409).json(
      //   response({
      //     success: false,
      //     message: error_code[-1006],
      //     error: "-1006",
      //   })
      // );
    }
  } catch (error) {

    return next({ status: 500, error: { errno: -1003 } })
    // return res.status(500).json(response({
    //   success: false,
    //   error: -1003,
    //   message: error_code[-1003]
    // }))
  }
};
// get Guest-info at roomNo

const getGuestInfo = (req, res, next) => {
  try {
    const roomNo = req.query.room_no;
    const guestId = req.query.guest_id;
    const hotelId = req.query.hotel_id;


    if (!roomNo || !guestId || !hotelId) {

      // return res.status(400).json(response({
      //   success: false,
      //   error: -1004,
      //   message: error_code[-1004]
      // }))
      return next({
        status: 400,
        error: { errno: -1004 }
      })
    }

    return getGuestService(roomNo, guestId,hotelId)
      .then((data) => {
        return res
          .status(200)
          .json(response({ success: true, payload: data[0] }));
      })
      .catch((error) => {


        return next(
          { status: 500, error: error }
        )
        // return res.status(500).json(response({
        //   success: false,
        //   error: error.code ? error.errno : -1012,
        //   message: error.code ? error_code[error.errno] : error_code[-1012]
        // }))
      });

  } catch (error) {

    return next({ status: 500, error: { errno: -1003 } })
  }
};


const newsLetter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        response({
          success: false,
          error: -1005,
          message: errors.array(),
        })
      );
    }
    const email = req.body.email;
    const emailExit = await getNewsletter(email);
    let filterEmail = emailExit[0].map((v) => {
      return v.email === email ? v.email : email;
    });
    if (filterEmail.length === 0) {
      return newsLetterService(email)
        .then((data) => {
          return res.status(202).json(
            response({
              message: `Email inserted successfully`,
            })
          );
        })
        .catch((error) => {

          return next({ status: 500, error: error })
          // return res.status(500).json(response({
          //   success: false,
          //   error: error.code ? error.errno : -1012,
          //   message: error.code ? error_code[error.errno] : error_code[-1012]
          // }))
        });
    } else {


      return next({ status: 409, error: { errno: -1006 } })

      // return res.status(409).json(
      //   response({
      //     success: false,
      //     message: error_code[-1006],
      //     error: "-1006",
      //   })
      // );
    }

  } catch (error) {

    return next({ status: 500, error: { errno: -1003 } })
    // return res.status(500).json(response({
    //   success: false,
    //   error: -1003,
    //   message: error_code[-1003]
    // }))
  }
};


const postUserFeedback = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json(
        response({
          success: false,
          error: -1005,
          message: errors.array(),
        })
      );
    }
    // format(new Date(req.body.hours), "yyyy-MM-dd HH:mm:ss");
    //  const hours = req.body.hours
    // const hours = format(new Date(req.body.hours), "yyyy-MM-dd HH:mm:ss")
    const hours = req.body.hours
    const room_temp = req.body.room_temp_level;
    const hotel_temp = req.body.hotel_temp_level;
    const guestId = req.body.guest_id;
    return postUserFeedbackService(hours, room_temp, hotel_temp, guestId)
      .then((data) => {
        return res.status(202).json(
          response({
            message: "feedback submitted successfully",
          })
        );
      })
      .catch((error) => {

        return next({ status: 500, error: error })
        // return res.status(500).json(response({
        //   success: false,
        //   error: error.code ? error.errno : -1012,
        //   message: error.code ? error_code[error.errno] : error_code[-1012],
        //   payload: error
        // }))
      });
  } catch (error) {

    return next({ status: 500, error: { errno: -1003 } })
    // return res.status(500).json(response({
    //   success: false,
    //   error: -1003,
    //   message: error_code[-1003]
    // }))
  }
};

module.exports = {
  postGuestDetail,
  getGuestInfo,
  newsLetter,
  postUserFeedback,
};

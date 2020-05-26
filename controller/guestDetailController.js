const { format } = require("date-fns");
var dateFns = require("date-fns");
const { validationResult } = require("express-validator");
const {
  postGuestDetailService,
  getGuestService,
  newsLetterService,
  getNewsletter,
  postUserFeedbackService,
  getGuestInfoDataService,
} = require("../service/guestService");
const response = require("../config/response");

const postGuestDetail = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, error: { errno: -1005 } });
    }
    const firstName = req.body.first_name;
    const lastName = req.body.last_name;
    const roomNumber = req.body.room_no;
    const checkInDate = format(
      new Date(req.body.check_in),
      "yyyy-MM-dd HH:mm:ss"
    );
    const checkOutDate = format(
      new Date(req.body.check_out),
      "yyyy-MM-dd HH:mm:ss"
    ); //Date.parse(req.body.checkOut)
    const hotelId = req.body.hotel_id;

    const checkGuestInfo = await getGuestInfoDataService();
    const filter = checkGuestInfo[0].filter((v) => {
      return (
        v.first_name == firstName &&
        v.last_name == lastName &&
        v.room_no == roomNumber &&
        dateFns.compareAsc(
          Date.parse(req.body.check_in),
          Date.parse(v.checkin_datetime)
        ) === 0 &&
        dateFns.compareAsc(
          Date.parse(req.body.check_out),
          Date.parse(v.checkout_datetime)
        ) === 0 &&
        v.hotel_id == hotelId
      );
    });
    if (filter.length === 0) {
      return postGuestDetailService(
        firstName,
        lastName,
        roomNumber,
        checkInDate,
        checkOutDate,
        hotelId
      )
        .then((data) => {
          if (data[0].affectedRows === 1) {
            const guest_id = data[0].insertId;
            res.status(201).json(
              response({
                success: true,
                payload: {
                  guest_id,
                  first_name: firstName,
                  last_name: lastName,
                  check_in: checkInDate,
                  check_out: checkOutDate,
                  room_no: roomNumber,
                  hotel_id: hotelId,
                },
                message: `Guest info inserted successfully with guest id =${guest_id}`,
              })
            );
          }
        })
        .catch((error) => {
          return next({ status: 500, error: error });
        });
    } else {
      return next({ status: 409, error: { errno: -1006 } });
    }
  } catch (error) {
    return next({ status: 500, error: { errno: -1003 } });
  }
};

// get Guest-info at roomNo
const getGuestInfo = (req, res, next) => {
  try {
    const roomNo = req.query.room_no;
    const guestId = req.query.guest_id;
    const hotelId = req.query.hotel_id;

    if (!roomNo || !guestId || !hotelId) {
      return next({
        status: 400,
        error: { errno: -1004 },
      });
    }
    return getGuestService(roomNo, guestId, hotelId)
      .then((data) => {
        return res
          .status(200)
          .json(response({ success: true, payload: data[0] }));
      })
      .catch((error) => {
        return next({ status: 500, error: error });
      });
  } catch (error) {
    return next({ status: 500, error: { errno: -1003 } });
  }
};

const newsLetter = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, error: { errno: -1005 } });
    }
    const email = req.body.email;
    const hotelId = req.body.hotel_id;
    const roomNo = req.body.room_no;

    const emailExit = await getNewsletter(email);
    // map return   v.email === email ? v.email : email
    const filterEmail = emailExit[0].filter((v) => {
      return v.email == email && v.hotel_id == hotelId;
    });
    if (filterEmail.length === 0) {
      return newsLetterService(email, hotelId, roomNo)
        .then((data) => {
          return res.status(202).json(
            response({
              payload: { email },
              message: `Email inserted successfully`,
            })
          );
        })
        .catch((error) => {
          return next({ status: 500, error: error });
        });
    } else {
      return next({ status: 409, error: { errno: -1006 } });
    }
  } catch (error) {
    return next({ status: 500, error: { errno: -1003 } });
  }
};

const postUserFeedback = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, error: { errno: -1005 } });
    }

    const hours = req.body.hours;
    const room_temp = req.body.room_temp_level;
    const hotel_temp = req.body.hotel_temp_level;
    const guestId = req.body.guest_id;
    const hotelId = req.body.hotel_id;
    const roomNo = req.body.room_no;
    return postUserFeedbackService(
      hours,
      room_temp,
      hotel_temp,
      guestId,
      hotelId,
      roomNo
    )
      .then((data) => {
        return res.status(202).json(
          response({
            payload: {
              hours,
              room_temp,
              hotel_temp,
              room_no: roomNo,
              hotel_id: hotelId,
            },
            message: "feedback submitted successfully",
          })
        );
      })
      .catch((error) => {
        return next({ status: 500, error: error });
      });
  } catch (error) {
    return next({ status: 500, error: { errno: -1003 } });
  }
};

module.exports = {
  postGuestDetail,
  getGuestInfo,
  newsLetter,
  postUserFeedback,
};

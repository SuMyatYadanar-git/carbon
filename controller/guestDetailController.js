const { sub, set, add, parseISO, format, isBefore } = require("date-fns");
const dateFns = require("date-fns");
const dateFnsZone = require("date-fns-tz");
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

const postGuestDetail =async (req, res) => {
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
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const roomNumber = req.body.roomNumber;
  const checkInDate =format(new Date(req.body.checkIn), "yyyy-MM-dd HH:mm:ss");
  const checkOutDate =format(new Date(req.body.checkOut), "yyyy-MM-dd HH:mm:ss")  //Date.parse(req.body.checkOut) 
  // // format(
  //   new Date(req.body.checkOut),
  //   "yyyy-MM-dd HH:mm:ss"
  // );
  const checkGuestInfo = await getGuestInfoDataService()
  const filter = checkGuestInfo[0].filter((v)=>{
    return v.first_name == firstName && 
    v.last_name == lastName && 
    v.room_no == roomNumber &&
    dateFns.compareAsc( Date.parse(req.body.checkIn), Date.parse(v.checkin_datetime))===0 && 
    dateFns.compareAsc( Date.parse(req.body.checkOut), Date.parse(v.checkout_datetime))===0
  })
if (filter.length === 0){
  return postGuestDetailService(
    firstName,
    lastName,
    roomNumber,
    checkInDate,
    checkOutDate
  )
    .then((data) => {
      return res.status(201).json(
        response({
          message: `Guest info inserted successfully`,
        })
      );
    })
    .catch((error) => {
      return res.status(400).json(
        response({
          success: false,
          message: error,
          error: error.errno == 1054 || error.errno == 1064 ? "-1004" : "-1008",
        })
      );
    });
}else{
  return res.status(409).json(
        response({
          success: false,
          error: "-1006",
        })
      );
}
};
// get Guest-info at roomNo
const getGuestInfo = (req, res) => {
  const roomNo = req.query.room_no;
  const guestId = req.query.guest_id;
  return getGuestService(roomNo, guestId)
    .then((data) => {
      return res
        .status(200)
        .json(response({ success: true, payload: data[0] }));
    })
    .catch((error) => {
      return res.status(400).json(
        response({
          success: false,
          message: error.code,
          error: error.errno == 1054 || error.errno == 1064 ? "-1004" : "-1008",
        })
      );
    });
};

const newsLetter = async (req, res) => {
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
            message: `Guest info inserted successfully`,
          })
        );
      })
      .catch((error) => {
        return res.status(400).json(
          response({
            success: false,
            message: error.code,
            error:
              error.errno == 1054 || error.errno == 1064 ? "-1004" : "-1008",
          })
        );
      });
  } else {
    return res.status(409).json(
      response({
        success: false,
        message: error.code,
        error: "-1006",
      })
    );
  }
};

const postUserFeedback = (req, res) => {
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
  const hours = format(new Date(req.body.hours), "yyyy-MM-dd HH:mm:ss")
  const room_temp = req.body.room_temp_level;
  const hotel_temp = req.body.hotel_temp_level;
  const guestId = req.body.guest_id;
  // console.log('format hours:',format(new Date(req.body.hours), "yyyy-MM-dd HH:mm:ss"))
  return postUserFeedbackService(hours, room_temp, hotel_temp,guestId)
    .then((data) => {
      return res.status(202).json(
        response({
          message: "feedback submitted successfully",
        })
      );
    })
    .catch((error) => {
      return res.status(400).json(
        response({
          success: false,
          message: error,
          error: error.errno == 1054 || error.errno == 1064 ? "-1004" : "-1008",
        })
      );
    });
};

module.exports = {
  postGuestDetail,
  getGuestInfo,
  newsLetter,
  postUserFeedback,
};

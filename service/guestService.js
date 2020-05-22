const db = require('../db/carbonoffset_db')

// post guest-detail
const postGuestDetailService = (firstName,lastName,roomNumber,checkInDate,checkOutDate,hotelId)=>{
	return db.postGuestDetail(firstName,lastName,roomNumber,checkInDate,checkOutDate,hotelId)
}
// get guest-detail service
const getGuestService =(roomNo,guestId,hotelId)=>{
	return db.getGuestInfoWithRoomNo(roomNo,guestId,hotelId)
}
const getGuestInfoDataService =()=>{
	return db.guestExits()
}

// post newsletter email
const newsLetterService=(email,hoetelId,roomNo)=>{
	return db.newsLetter(email,hoetelId,roomNo)
}
const getNewsletter = (email)=>{
	return db.newsLetterMailExist(email)
}
// post user-feedback
const postUserFeedbackService =(hours,room_temp,hotel_temp,guestId,hotelId,roomNo)=>{
	return db.postUserFeedback(hours,room_temp,hotel_temp,guestId,hotelId,roomNo)
}

module.exports = {postGuestDetailService,getGuestService,newsLetterService,getNewsletter,postUserFeedbackService,getGuestInfoDataService}
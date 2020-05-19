const db = require('../db/carbonoffset_db')

// post guest-detail
const postGuestDetailService = (firstName,lastName,roomNumber,checkInDate,checkOutDate)=>{
	return db.postGuestDetail(firstName,lastName,roomNumber,checkInDate,checkOutDate)
}
// get guest-detail service
const getGuestService =(roomNo,guestId)=>{
	return db.getGuestInfoWithRoomNo(roomNo,guestId)
}
const getGuestInfoDataService =()=>{
	return db.guestExits()
}

// post newsletter email
const newsLetterService=(email)=>{
	return db.newsLetter(email)
}
const getNewsletter = (email)=>{
	return db.newsLetterMailExist(email)
}
// post user-feedback
const postUserFeedbackService =(hours,room_temp,hotel_temp,guestId)=>{
	return db.postUserFeedback(hours,room_temp,hotel_temp,guestId)
}

module.exports = {postGuestDetailService,getGuestService,newsLetterService,getNewsletter,postUserFeedbackService,getGuestInfoDataService}
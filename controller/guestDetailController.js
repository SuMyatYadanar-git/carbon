
const { sub, set, add, parseISO, format, isBefore } = require("date-fns");
const dateFns = require("date-fns");
const dateFnsZone = require("date-fns-tz");
const {  validationResult } = require('express-validator');
const {postGuestDetailService,getGuestService,newsLetterService,getNewsletter,postUserFeedbackService} =require('../service/guestService')
const response = require('../config/response')


const postGuestDetail =(req,res)=>{
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
	  return res.status(422).json({ 
		success:false,
		error:-1005,
		message: errors.array() 
	 })
	}
	const firstName = req.body.firstName
	const lastName = req.body.lastName
	const roomNumber = req.body.roomNumber
	const checkInDate = format(new Date(req.body.checkIn),"yyyy-MM-dd HH:mm")
	const checkOutDate = format(new Date(req.body.checkOut),"yyyy-MM-dd HH:mm:ss")
	return postGuestDetailService(firstName,lastName,roomNumber,checkInDate,checkOutDate)
	.then(data => {return  res.status(201).json({success:true,message:`Guest info inserted successfully`,error:null});})
	.catch(err =>{ 
		// return res.status(400).json({success:false,error:err})
		if(err.errno == 1054 ){
            return res.status(400).json({
				// error:error_code["-1004"],
				success:false,
                error:-1004,
            })
        }else{
            console.log(err,'guest_detail')
            return  res.status(503).json({
					// error:error_code["-1008"],
					success:false,
                    error:-1008,
                    // message:error
				})
			}
	})
}
// get Guest-info at roomNo
const getGuestInfo=(req,res)=>{
	const roomNo = req.query.roomNo
	const guestId = req.query.guestId
	return getGuestService(roomNo,guestId)
	.then(data => {
		return  res.status(200).json({success:true,payload:data[0],error:null})
	})
	.catch(error=>{
		console.log('Error getGuest',error.toString())
		return  res.status(503).json({
			success:false,
			error:-1008
		})	
	})

}


const newsLetter=async(req,res)=>{
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
	  return res.status(422).json({ 
		success:false,
		error:-1005,
		message: errors.array() 
	})
	}
	const email = req.body.email
	const emailExit = await getNewsletter(email)	
	let filterEmail =emailExit[0].map(v=>{
	return v.email === email ? v.email : email
	})
	if(filterEmail.length === 0){
		return newsLetterService(email)
		.then(data=>{
			  return  res.status(202).json({success:true,message:'email submitted successfully',error:null})
			})
		.catch(err =>{
			// return res.status(400).json({success:false,error:err})
			if(err.errno == 1054 ){
				return res.status(400).json({
					// error:error_code["-1004"],
					success:false,
					error:-1004,
				})
			}else{
				console.log(err,'news_letter')
				return  res.status(503).json({
						// error:error_code["-1008"],
						success:false,
						error:-1008,
						// message:error
					})
				}
		})
	 }else{
		  return res.status(409).json({success:false,error:-1006})
	 }
	}

	const postUserFeedback =(req,res)=>{
		// console.log('hello feedback',req.body.hours)
		const errors = validationResult(req)
		if (!errors.isEmpty()) {
		  return res.status(422).json({ 
			success:false,
			error:-1005,
			message: errors.array() 
		})
		}
		const hours = req.body.hours
		const room_temp = req.body.room_temp_level
		const hotel_temp = req.body.hotel_temp_level
		return postUserFeedbackService(hours,room_temp,hotel_temp)
		.then(data =>{
			return  res.status(202).json({success:true,message:'feedback submitted successfully',error:null})
		})
		.catch(err =>{
			// return res.status(400).json({success:false,error:err})
			if(err.errno == 1054 ){
				return res.status(400).json({
					success:false,
					error:-1004,
				})
			}else{
				console.log(err,'feedback')
				return  res.status(503).json({
						// error:error_code["-1008"],
						success:false,
						error:-1008,
						// message:error
					})
				}
		})
	}


module.exports = {postGuestDetail,getGuestInfo,newsLetter,postUserFeedback};
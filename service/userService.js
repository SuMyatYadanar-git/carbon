const db = require('../db/carbonoffset_db')

module.exports.userSignupService = (user)=>{
    return db.userSignup(user)
}
module.exports.allUser=()=>{
    return db.allUser()
}

module.exports.loginService = (user,callback)=>{
    return db.login(user,(error,data)=>{
        if(error) callback(error,null)
        else callback(null,data)
    })
}
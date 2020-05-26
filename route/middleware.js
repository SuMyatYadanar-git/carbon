const { verifyToken } = require("../security/token")
const response = require('../config/response')

const authenticationMiddleware = (req, res, next) => {
    const authorization = req.headers['authorization']
    if(!authorization) {
        next({ status: 401, error: { errno: -1016 } })
        //     error:"Not authorized user!"
    }
    else if(!authorization.split(" ")[1]) {
         next({ status: 401, error: { errno: -1016 } })
        //     error:"Not authorized user!"
    }
    else {
        return verifyToken(`${authorization.split(" ")[1]}`, (error, data) => {
            if(error) {
                next({ status: 401, error: { errno: -1017 } })
                // res.status(400).json(response({
                //     success:false,
                //     error:error.message
                // }))
            }
            else {
                // console.log(" data1234 ", data)
               next()
            }
        })
    }
}

module.exports = {
    authenticationMiddleware,
}

// message config

const msgInfo = {
    message: {
        error: {
            "-1001": "Server not responding",
            "-1002": "Server not found",
            "-1003": "Internal server error",
            "-1004": "Invalid request payload.",
            "-1005": "Invalid request format",
            "-1006": "Input already exists",
            "-1007": "Calculation error",
            "-1008": "Service unavailable",
            "-1009": "Connection closed",
            "-1010": "DB connection lost",
            "-1011": "No Raw Data(NAN)",
        }
    },
    status: {
        success: "success",
        error: "error",
        successLogin: "Login Success",

    }
}

module.exports =  msgInfo ;
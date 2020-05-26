const error_code={

        "-1001":"Server not responding.",
        "-1002":"Server url not found.",
        "-1003":"Internal server error.",
        "-1004":"Invalid request payload.",
        "-1005":"Invalid request format.",
        "-1006":"Input already exists.",
        "-1007":"Calculation error.",
        "-1008":"Service unavailable.",
        "-1009":"Connection closed.",
        "-1010":"DB connection lost.",
        "-1011":"No Raw Data(NAN).",
        "-1012":"Something went wrong.",
        "-1013":"Invalid date requested.",
        "-1014":"End date must be greater than start date",
        "-1015":"User name and password does not match",
        "-1016":"Not authorized user!",
        "-1017":"Token expired!",

        "1054" :"Unknown column in sql.",
        "1064" :"SQL syntax error.",
        "1062" : "DB duplicate entry.",
        "1146" : "DB table does not exist.",

}
// 409 conflict
// error:error_code["-1004"]
 module.exports = error_code


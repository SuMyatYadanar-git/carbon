const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const {
  userSignupService,
  loginService,
  allUser,
} = require("../service/userService");
const response = require("../config/response");

module.exports.userSignup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, error: { errno: -1005 } });
    }
    const user = {
      name: req.body.user_name,
      password: req.body.password,
      email: req.body.email,
    };
    const checkUser = await allUser();
    const filterUser = checkUser[0].filter((v) => {
      return (
        v.user_name == user.name &&
        v.email == user.email &&
        v.password == user.password
      );
    });
    if (filterUser.length === 0) {
      return userSignupService(user)
        .then((data) => {
          if (data[0].affectedRows === 1) {
            const id = data[0].insertId;
            res.status(201).json(
              response({
                success: true,
                payload: { id, user_name: user.name, email: user.email },
                message: "user created successfully",
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

module.exports.userLogin = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next({ status: 422, error: { errno: -1005 } });
    }
    const user = {
      name: req.body.userName,
      password: req.body.password,
      email: req.body.email,
    };
    loginService(user, (error, data) => {
      if (error) {
        return next({ status: 400, error: { errno: -1015 } });
      } else {
        res.json(
          response({
            payload: data,
          })
        );
      }
    });
  } catch (error) {
    return next({ status: 500, error: { errno: -1003 } });
  }
};

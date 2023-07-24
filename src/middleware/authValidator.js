const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config({
  path: path.resolve(".env"),
});

const validateRegistration = [
  body("username").notEmpty().withMessage("Username is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("phone").notEmpty().withMessage("Phone number is required"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
];

const validatePassword = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
];

const validateChangePassword = [
  body("newPassword")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{6,})/)
    .withMessage(
      "Password must have a minimum of 6 characters, 1 symbol, and 1 capital letter"
    ),
  body("confirmPassword")
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage("Confirm password must match password."),
];

const validateChangeUsername = [
  body("currentUsername").notEmpty().withMessage("Must not be empty"),
  body("newUsername").notEmpty().withMessage("Must not be empty"),
  // .not()
  // .equals(body("currentUsername"))
  // .withMessage("Current Username and New Username must not match"),
];

// functions
const authValidator = {
  inputValidator: (req, res, next) => {
    // destruct to access error
    const { errors } = validationResult(req);
    console.log(errors);
    if (errors.length > 0) {
      return res.status(400).json({
        errors: errors,
      });
    }
    next();
  },

  verifyToken: (req, res, next) => {
    let token = req.headers.authorization;
    if (!token) {
      return res.status(401).send("Access Denied!");
    }
    // return res.json(token);

    try {
      token = token.split(" ")[1];
      if (token === "null" || !token) {
        return res.status(401).send("Access Denied!");
      }

      let verifiedUser = jwt.verify(token, process.env.JWT_KEY);
      if (!verifiedUser) {
        return res.status(401).send("Unauthorized request");
      }

      req.user = verifiedUser;
      console.log(req.user);
      next();
    } catch (err) {
      return res.status(400).send("Invalid Token");
    }
  },
};

module.exports = {
  // authValidator,
  // verifyToken,
  validateRegistration,
  validatePassword,
  validateChangePassword,
  validateChangeUsername,
  authValidator,
};

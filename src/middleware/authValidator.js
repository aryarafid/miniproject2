const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const path = require("path");
require("dotenv").config({
  path: path.resolve(".env"),
});

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
  authValidator,
};

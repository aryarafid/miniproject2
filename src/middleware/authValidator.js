const { body, validationResult } = require("express-validator");

const authValidator = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (errors) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }
  next();
};

module.exports = {
  authValidator
};

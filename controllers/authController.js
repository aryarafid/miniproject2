const axios = require("axios");

const welcome = async (req, res) => {
  try {
    res.json("lil bitch");
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// register -> /register
// router.get("/register", register);

//verify

// login -> /login
// router.get("/login", login);

// keep login ->

// forgot password ->

// reset  password ->

// change password ->

// change username ->

// change phone ->

// change email ->

module.exports = {
  // getAllExpense,
  // getExpenseById,
  welcome,
};

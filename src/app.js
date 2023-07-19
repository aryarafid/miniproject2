const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const PORT = process.env.PORT || 8000;
const express = require("express");
const app = express();
app.use(express.json());

//db
const db = require("./models");
// db.sequelize.sync({ alter: true });
db.sequelize.sync();

// route
const { authRouter, blogRouter } = require("./routes");

// middleware goes here
app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);
// no user router krn semua operasinya masuk auth

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

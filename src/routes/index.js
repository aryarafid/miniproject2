// TIDAK ADA USERCONTROLLE DAN ROUTER KRN OPERASI GANTI ITEM PROFIL SEMUA BUTUH VERIFICATION DAN MASUKNYA DI AUTH AJA.

const authRouter = require("./authRouter");
const blogRouter = require("./blogRouter");
// const userRouter = require("./userRouter ");

module.exports = {
  authRouter,
  blogRouter,
  // userRouter,
};

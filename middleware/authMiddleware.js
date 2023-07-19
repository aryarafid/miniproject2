const authMiddleware = (req, res, next) => {
  console.log("Go thru me first young man");
  next();
};

module.exports = authMiddleware;

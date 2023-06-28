const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("./catchAsyncErrors");
const jwt = require("jsonwebtoken");
const User = require("../model/user");
const Shop = require("../model/shop");

exports.isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  // console.log(req);
  // console.log(req.cookies);
  const { USERTOKEN } = req.cookies;
  // console.log(USERTOKEN);
  if (!USERTOKEN) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(USERTOKEN, process.env.JWT_SECRET_KEY);

  // console.log("Decoded is: ", decoded);

  req.user = await User.findById(decoded.id);
  // console.log(req);
  // console.log("req.use is the : ", req.use);
  // console.log(req.cookies);
  next();
});

exports.isSeller = catchAsyncErrors(async (req, res, next) => {
  const { SHOPTOKEN } = req.cookies;
  if (!SHOPTOKEN) {
    return next(new ErrorHandler("Please login to continue", 401));
  }

  const decoded = jwt.verify(SHOPTOKEN, process.env.JWT_SECRET_KEY);

  req.seller = await Shop.findById(decoded.id);

  next();
});

exports.isAdmin = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`${req.user.role} can not access this resources!`)
      );
    }
    next();
  };
};

//create token and saving in cookies
const sendJWTToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  // console.log(token);

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
    // domain: "ecommerce-backend-9nv3.onrender.com",
  };

  res.status(statusCode).cookie("USERTOKEN", token, options).json({
    success: true,
    user,
    token,
  });
  // console.log(res);
};

module.exports = sendJWTToken;

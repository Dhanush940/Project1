//create shop token and saving in cookies
const sendSHOPToken = (user, statusCode, res) => {
  const token = user.getJwtToken();
  // console.log(token);

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("SHOPTOKEN", token, options).json({
    success: true,
    user,
    token,
  });
  // console.log(res);
};

module.exports = { sendSHOPToken };

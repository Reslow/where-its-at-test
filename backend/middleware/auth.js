const { getAccountByUsername } = require("../database/operations");
const jwt = require("jsonwebtoken");

//***check loggedin user through token and then check the role

async function staff(req, res, next) {
  // get token
  const token = req.headers.authorization.replace("Bearer ", "");

  let account;
  const responseObject = {
    sessionHasExpired: false,
    staffRole: true,
  };

  // verify the token and get the username from the token
  try {
    const data = jwt.verify(token, "a1b2c3");
    account = await getAccountByUsername(data.username);
  } catch (error) {
    responseObject.sessionHasExpired = true;
  }

  if (!account || account.length == 0 || account[0].role != "staff") {
    responseObject.staffRole = false;
    return res.json(responseObject);
  }
  next();
}

module.exports = { staff };

const { getAccountByUsername } = require("../database/operations");
const jwt = require("jsonwebtoken");

async function staff(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");
  // console.log(`token ${token}`);
  //  hämta namn genom token  och seda hämta role
  let account;
  try {
    const data = jwt.verify(token, "a1b2c3");
    console.log(data);
    account = await getAccountByUsername(data.username);
    console.log(account);
  } catch (error) {
    console.log(error);
  }

  try {
    if (account.length == 0) {
      throw new Error();
    } else if (account[0].role == "staff") {
      next();
    }
  } catch (error) {
    console.log(error);
    console.log("unauthorized!");
    return error;
  }
}

module.exports = { staff };

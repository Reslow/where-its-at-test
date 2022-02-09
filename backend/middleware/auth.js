const { getAccountByUsername } = require("../database/operations");
const jwt = require("jsonwebtoken");
const { response } = require("express");

async function staff(req, res, next) {
  const token = req.headers.authorization.replace("Bearer ", "");
  // console.log(`token ${token}`);
  //  hämta namn genom token  och seda hämta role
  let account;
  const responseObject = {
    errorMessage: "unAuthorized!",
  };

  try {
    const data = jwt.verify(token, "a1b2c3");
    account = await getAccountByUsername(data.username);
  } catch (error) {
    console.log(error);
  }

  if (account.length == 0 || account[0].role != "staff") {
    return res.json(responseObject);
  }
  next();
}

module.exports = { staff };

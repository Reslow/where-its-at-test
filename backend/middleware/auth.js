const { getAccountByUsername } = require("../database/operations");

async function staff(req, res, next) {
  const user = req.body;
  // console.log(user.username);
  const account = getAccountByUsername(user.username);
  try {
    if (account.length == 0) {
      throw new Error();
    } else if (account[0].role == "staff") {
      next();
    }
  } catch (error) {
    const responseObject = {
      success: false,
      errorMessage: "unauthorized",
    };
    res.json(responseObject);
  }
}

module.exports = { staff };

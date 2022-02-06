const { getAccountByUsername } = require("../databse/operations");

async function staff(req, res, next) {
  const user = req.body;
  console.log(user.username);
  const account = getAccountByUsername(user.username);
  try {
    // om vi inte hittar ett anvädarkonto
    if (account.length == 0) {
      throw new Error();
    } else if (account[0].role == "staff") {
      next();
    } else {
      throw new Error();
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

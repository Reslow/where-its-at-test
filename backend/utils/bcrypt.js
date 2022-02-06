const bcrypt = require("bcryptjs");
//hur många gånger den ska krypteras
const saltRounds = 10;

async function hashPassword(password) {
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log(`hashedpassword: ${hashedPassword}`);
  return hashedPassword;
}

async function comparePassword(password, storedPassword) {
  const isTheSame = await bcrypt.compare(password, storedPassword);
  console.log(`isTheSame: ${isTheSame}`);
  return isTheSame;
}

module.exports = { hashPassword, comparePassword };

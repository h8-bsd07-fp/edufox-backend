const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const tokenCreate = (payload) => {
  return jwt.sign(payload, SECRET_KEY);
};

const tokenVerification = (token) => {
  return jwt.verify(token, SECRET_KEY);
};

module.exports = { tokenCreate, tokenVerification };

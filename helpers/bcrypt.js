const bcrypt = require("bcryptjs");

const hashPassword = (plaintext) => bcrypt.hashSync(plaintext);

const plaintextAndPasswordCompare = (plaintext, hash) =>
  bcrypt.compareSync(plaintext, hash);

module.exports = { hashPassword, plaintextAndPasswordCompare };

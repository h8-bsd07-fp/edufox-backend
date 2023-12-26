const errorHandler = (err, req, res, next) => {
  console.log(err);
  let statusCode = 500;
  let message = "Internal server error";

  if (
    err.name === "SequelizeValidationError" ||
    err.name === "SequelizeUniqueConstraintError"
  ) {
    statusCode = 400;
    message = err.errors[0].message;
  }

  if (err.message === "EMPTY_INPUT") {
    statusCode = 400
    message = "Please fill all ields"
  }

  if (err.message === "TOKEN_INVALID") {
    statusCode = 401;
    message = "Invalid token"
  }

  if (err.message === "DONT_AUTHORIZED") {
    statusCode = 403;
    message = "You dont have the authorize";
  }
  if (err.message === "USER_NOT_FOUND" || err.message === "PASSWORD_INVALID") {
    statusCode = 404;
    message = "Email or Password Invalid"
  }

  if (err.message === "DATA_NOT_FOUND") {
    statusCode = 404
    message = "Data not found"
  }

  if (err.message === "ALREADY_EXISTS") {
    statusCode = 409
    message = "You are currently taking this course"
  }

  res.status(statusCode).json({
    statusCode,
    message,
  });
};

module.exports = errorHandler;

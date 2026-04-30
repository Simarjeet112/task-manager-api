const AppError = require('../utils/AppError');


const handlePgUniqueConstraint = () =>
  new AppError('A user with that email already exists.', 409);

const handleJWTExpired = () =>
  new AppError('Your session has expired. Please log in again.', 401);


const handleJWTInvalid = () =>
  new AppError('Invalid token. Please log in again.', 401);


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,     
    error: err,
  });
};


const sendErrorProd = (err, res) => {
  if (err.isOperational) {
  
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    
    console.error(' UNEXPECTED ERROR:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err, message: err.message };

 
    if (err.code === '23505') error = handlePgUniqueConstraint(); // pg duplicate
    if (err.name === 'TokenExpiredError') error = handleJWTExpired();
    if (err.name === 'JsonWebTokenError') error = handleJWTInvalid();

    sendErrorProd(error, res);
  }
};
const errorHandler = async (error, req, res, _next) => {
  const statusCode = error.statusCode || 500;
  let message;
  if (error.isOperational) {
    message = error.message;
  } else {
    message = "Something went wrong";
  }

  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      code: "INTERNAL_SERVER_ERROR",
      statusCode,
    },
  });
};

export default errorHandler;

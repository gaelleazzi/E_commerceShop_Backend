const adminMiddleware = (req, res, next) => {
  if (req.userType !== "admin") {
    console.log("Checking user type:", req.userType); // Debug log
    const error = new Error("Not authorized.");
    error.statusCode = 403;
    return next(error);
  }
  next();
};

export default adminMiddleware;

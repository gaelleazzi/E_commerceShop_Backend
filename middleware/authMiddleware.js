import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    return next(error);
  }

  const token = authHeader.split(" ")[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "yourSecretKey");
  } catch (err) {
    err.statusCode = 500;
    return next(err);
  }

  if (!decodedToken) {
    const error = new Error("Not authenticated.");
    error.statusCode = 401;
    return next(error);
  }

  req.userId = decodedToken.userId;
  req.userType = decodedToken.type;
  console.log("User type:", req.userType);
  next();
};

export default authMiddleware;

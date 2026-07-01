// responsible for reading JWT from headers
//verifying the token
// attaching the req.user
const jwt = require("jsonwebtoken");

// Middleware function to authenticate requests using JWT
const authMiddleware = (req, res, next) => {
  //get the token from authorization header
  // bearer <token>
  const authHeader = req.headers.authorization;

  // Check if the authorization header is present and starts with "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  // Extract the token from the header
  const token = authHeader.split(" ")[1];

  try {
    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //attach only required user info to req.user
    req.user = {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role,
    };
    // Proceed to the next middleware or route handler
    next();

    // If token verification fails, catch the error and respond with an appropriate message
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};
// Export the authMiddleware function to be used in other parts of the application
module.exports = authMiddleware;

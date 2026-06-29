// responsible for  rules on the user and admin

const authorizationMiddleware = (role) => {
  // Middleware function to check if the user has the required role
  return (req, res, next) => {
    // Check if the user exists
    if (!req.user) {
      // If the user does not have the required role, respond with a 403 Forbidden status
      return res.status(403).json({ message: "Unauthorized" });
    }
    // If the user has the required role
    if (req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

// Export the authorizationMiddleware function to be used in other parts of the application
module.exports = authorizationMiddleware;

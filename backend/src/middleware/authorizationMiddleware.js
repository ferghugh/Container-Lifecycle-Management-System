// responsible for  rules on the user and admin

const authorizationMiddleware = (...roles) => {

  return (req, res, next) => {

    // User must be authenticated
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized"
      });
    }

    // User must have one of the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }
// If the user is authenticated and has the required role, proceed to the next middleware or route handler
    next();

  };

};

module.exports = authorizationMiddleware;


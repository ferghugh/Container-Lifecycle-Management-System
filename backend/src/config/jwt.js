//src/ config/jwt.js


const jwt = require("jsonwebtoken");

//generate a JWT token for a user with a specific expiration time
function generateToken(user) {
  return jwt.sign(
    { 
     id: user.id,
     role: user.role 
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' },
  );
}
//verify a JWT token and return the decoded payload
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}
module.exports = {
  generateToken,
  verifyToken,
};


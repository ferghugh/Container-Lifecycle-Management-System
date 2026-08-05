// controllers/authController.js

//handles authentication requests such as login and logout
//uses bycrypt to verify passwords
//uses JWT for token generation and verification
//Interacts with the UserModel to retrieve user data from the database
const bcrypt = require("bcrypt");
const jwtConfig = require("../config/jwt");
const userModel = require("../models/userModel");

// authController to handle login and logout requests

async function login(req, res) {
  // Extract username and password from the request body

  try {
    const { username, password } = req.body;
    // Validate that both username and password are provided in the request
    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "Username and password required" });
    }
  
    // Find the user in the database by username

    const user = await userModel.findByUsername(username);

    // If the user is not found, return an error response
    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
   
    // Compare the provided password with the stored password hash using bcrypt
    const match = await bcrypt.compare(password, user.password_hash);

    
  
    // If the password does not match, return an error response
    if (!match) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    // Generate a JWT token for the authenticated user
    const token = jwtConfig.generateToken(user);
    // Update the user's last login time in the database for audit purposes
    await userModel.updateLastLogin(user.id);

    res.json({
      message: "Login successful",
      token,
        user: { 
            id: user.id,
            username: user.username,
            role: user.role,
        },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  
  }
}
//  Logout function to handle logout requests ,client should delete the token
function logout(req, res) {
  res.json({ message: "Logout successful (client should delete token)" });
}

module.exports = {
  login,
  logout,
};

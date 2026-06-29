// routes/authRoutes.js
const express = require("express");
const router = express.Router();
// Import the authentication middleware and login controller
const authMiddleware = require("../middleware/authMiddleware");
const authController = require("../controllers/authController");

// Route to get the current user's information, protected by authentication middleware
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    role: req.user.role,
  });
});

// login
router.post("/login", authController.login);

// logout - client clears token
router.post("/logout", authMiddleware, authController.logout);

module.exports = router;

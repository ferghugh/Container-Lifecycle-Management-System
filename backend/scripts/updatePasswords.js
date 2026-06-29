const bcrypt = require("bcrypt");
const db = require("../src/config/database");

async function updatePasswords() {
  try {
    // Hash the password once
    const hash = await bcrypt.hash("password123", 10);

    // Update all users
    const [result] = await db.query(
      "UPDATE users SET password_hash = ?",
      [hash]
    );

    console.log(`✅ Updated ${result.affectedRows} users.`);
    console.log("All users now have the password: password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating passwords:", error.message);
    process.exit(1);
  }
}

updatePasswords();
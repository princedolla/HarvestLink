const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/harvestlink";

async function createAdmin(username, password) {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log("Admin already exists with this username.");
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = new Admin({
      username,
      passwordHash: hashedPassword,
    });

    await admin.save();

    console.log(`Admin user created: ${username}`);
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin:", err);
    process.exit(1);
  }
}

// Replace these values with your desired admin credentials:
const username = "admin";
const password = "admin123";

createAdmin(username, password);

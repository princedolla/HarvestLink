const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const sendOtpEmail = require("./utils/sendEmail");
const Farmer = require("./models/Farmer");
const Harvest = require("./models/Harvest");
const Admin = require("./models/Admin");
const authenticate = require("./auths/authMiddleware");
const adminAuthMiddleware = require("./auths/adminAuthMiddleware");

const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "harvestlink",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 600, crop: "limit" }],
  },
});

const upload = multer({ storage: cloudinaryStorage });

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secret123";

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/harvestlink", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

/* ================= AUTH ================= */

// Register
app.post("/api/register", upload.single("profileImage"), async (req, res) => {
  try {
    const { name, phone, email, location, password, farmName, crops } =
      req.body;

    const existing = await Farmer.findOne({ $or: [{ email }, { phone }] });
    if (existing)
      return res.status(400).json({ message: "Farmer already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const farmer = new Farmer({
      name,
      phone,
      email,
      location,
      password: hashedPassword,
      farmName,
      crops: JSON.parse(crops || "[]"),
      profileImage: req.file?.path || "",
    });

    await farmer.save();

    const token = jwt.sign({ id: farmer._id }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2d",
    });
    res.status(201).json({ token, farmer });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { phone, email, password } = req.body;
  try {
    const farmer = await Farmer.findOne({ $or: [{ phone }, { email }] });

    if (!farmer || !(await bcrypt.compare(password, farmer.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: farmer._id }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2d",
    });
    res.json({ token, farmer });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Farmer Profile
app.get("/api/farmer/profile", authenticate, async (req, res) => {
  try {
    const farmer = await Farmer.findById(req.user?.id).select("-password");
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });

    res.json(farmer);
  } catch (err) {
    console.error("Profile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Update farmer info route
app.put("/api/farmers/:id", authenticate, async (req, res) => {
  try {
    const farmerId = req.params.id;
    const updateData = req.body;

    // Optional: validate updateData fields

    const updatedFarmer = await Farmer.findByIdAndUpdate(farmerId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFarmer)
      return res.status(404).json({ message: "Farmer not found." });

    res.json(updatedFarmer);
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).json({ message: "Server error." });
  }
});



// Forgot Password
app.post("/api/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const farmer = await Farmer.findOne({ email });
    if (!farmer) return res.status(404).json({ message: "Email not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    farmer.resetToken = otp;
    farmer.resetTokenExpire = Date.now() + 10 * 60 * 1000;
    await farmer.save();

    await sendOtpEmail(email, otp);
    res.json({ message: "OTP sent to your email address" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// Reset Password
app.post("/api/reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const farmer = await Farmer.findOne({ email });

    if (
      !farmer ||
      farmer.resetToken !== otp ||
      Date.now() > farmer.resetTokenExpire
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    farmer.password = hashedPassword;
    farmer.resetToken = null;
    farmer.resetTokenExpire = null;

    await farmer.save();
    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ message: "Server error during password reset" });
  }
});

/* ================= HARVEST ================= */

// Get all
app.get("/api/harvests", async (req, res) => {
  try {
    const harvests = await Harvest.find()
      .populate("farmerId", "name email phone profileImage")
      .sort({ createdAt: -1 });

    res.json(harvests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// By farmer
app.get("/api/harvests/farmer/:farmerId", async (req, res) => {
  try {
    const harvests = await Harvest.find({
      farmerId: req.params.farmerId,
    }).populate("farmerId", "name phone email profileImage location");
    res.json(harvests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create new harvest
app.post("/api/harvests", authenticate, async (req, res) => {
  try {
    const {
      cropName,
      cropType,
      plantingDate,
      expectedHarvestDate,
      estimatedQuantity,
      unit,
      pricePerUnit,
      currency,
      description,
      imageUrls,
    } = req.body;

    // Validate required fields
    if (!cropName || !pricePerUnit) {
      return res
        .status(400)
        .json({ message: "Crop name and price per unit are required." });
    }

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image URL is required." });
    }

    const newHarvest = new Harvest({
      farmerId: req.user.id, // from authenticate middleware
      cropName,
      cropType,
      plantingDate: plantingDate || null,
      expectedHarvestDate: expectedHarvestDate || null,
      estimatedQuantity: estimatedQuantity || null,
      unit: unit || "kg",
      pricePerUnit,
      currency: currency || "USD",
      description: description || "",
      imageUrls,
    });

    await newHarvest.save();

    res.status(201).json(newHarvest);
  } catch (err) {
    console.error("Error creating harvest:", err.message);
    res.status(500).json({ message: "Server error while creating harvest." });
  }
});

// Update
app.put("/api/harvests/:id", authenticate, async (req, res) => {
  try {
    const updated = await Harvest.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Harvest not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete
app.delete("/api/harvests/:id", authenticate, async (req, res) => {
  try {
    const deleted = await Harvest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Harvest not found" });
    res.json({ message: "Harvest deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/* ================= ADMIN ================= */

// Admin login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await admin.verifyPassword(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: admin._id, role: "admin" }, JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "2d",
    });

    res.json({ token, admin: { username: admin.username, id: admin._id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin view harvests
app.get("/api/admin/harvests", adminAuthMiddleware, async (req, res) => {
  try {
    const harvests = await Harvest.find()
      .populate("farmerId", "name email phone profileImage")
      .sort({ createdAt: -1 });
    res.json(harvests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin delete harvest
app.delete("/api/admin/harvests/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const deleted = await Harvest.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Harvest not found" });
    res.json({ message: "Harvest deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin view farmers
app.get("/api/admin/farmers", adminAuthMiddleware, async (req, res) => {
  try {
    const farmers = await Farmer.find({ role: "farmer" }).select(
      "name email phone profileImage createdAt"
    );
    res.json(farmers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin delete farmer
app.delete("/api/admin/farmers/:id", adminAuthMiddleware, async (req, res) => {
  try {
    const deletedFarmer = await Farmer.findByIdAndDelete(req.params.id);
    if (!deletedFarmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.json({ message: "Farmer deleted successfully" });
  } catch (error) {
    console.error("Failed to delete farmer:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Bulk harvest import
app.post("/api/admin/harvests/bulk", adminAuthMiddleware, async (req, res) => {
  try {
    const harvests = req.body;
    if (!Array.isArray(harvests)) {
      return res.status(400).json({ error: "Expected an array of harvests." });
    }
    const created = await Harvest.insertMany(harvests);
    res.status(201).json({ message: "Bulk upload successful", data: created });
  } catch (err) {
    console.error("Bulk upload error:", err);
    res.status(500).json({ error: "Bulk upload failed" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

const jwt = require("jsonwebtoken");
const Farmer = require("../models/Farmer"); // optional: only if you want to verify user existence

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 🔒 Check if Authorization header exists and is in Bearer format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Basic version: attach decoded ID
    req.user = { id: decoded.id };

    // Optional: verify user exists (uncomment if needed)
    const farmer = await Farmer.findById(decoded.id).select("-password");
    if (!farmer) {
      return res.status(401).json({ message: "Farmer not found" });
    }
    req.user = farmer;

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authenticate;

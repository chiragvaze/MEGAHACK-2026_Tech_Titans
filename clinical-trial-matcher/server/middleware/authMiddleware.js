import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function authenticateToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [scheme, token] = authHeader.split(" ");

    if (scheme !== "Bearer" || !token) {
      return res.status(401).json({ message: "Authentication token is required" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({ message: "JWT secret is not configured" });
    }

    const payload = jwt.verify(token, jwtSecret);
    const user = await User.findById(payload.sub).select("_id name email role");

    if (!user) {
      return res.status(401).json({ message: "Invalid authentication token" });
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired authentication token" });
    }

    next(error);
  }
}

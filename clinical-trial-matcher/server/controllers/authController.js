import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

function buildToken(userId) {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    const error = new Error("JWT secret is not configured");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ sub: userId }, jwtSecret, { expiresIn: "12h" });
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const allowedRoles = ["doctor", "clinical_researcher"];
    const safeRole = allowedRoles.includes(role) ? role : "doctor";

    const existing = await User.findOne({ email: normalizedEmail }).select("_id");
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      passwordHash,
      role: safeRole
    });

    const token = buildToken(user._id.toString());
    return res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = buildToken(user._id.toString());
    return res.status(200).json({ token, user: sanitizeUser(user) });
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  return res.status(200).json({ user: req.user });
}

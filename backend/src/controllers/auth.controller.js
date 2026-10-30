const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

function generateToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "15m",
      algorithm: "HS256",
    },
  );
}

function setAuthCookie(res, token) {
  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

// REGISTER
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !name.trim() ||
      !email.trim() ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Enter a valid name, email, and password of 8–72 characters.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name.trim(), normalizedEmail, hashedPassword],
    );

    const user = {
      id: result.insertId,
      name: name.trim(),
      email: normalizedEmail,
    };

    const token = generateToken(user);

    setAuthCookie(res, token);

    return res.status(201).json({
      message: "Registration successful.",
      user,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "Email is already registered.",
      });
    }

    next(error);
  }
};

// LOGIN
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password ||
      password.length > 72
    ) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [users] = await pool.execute(
      "SELECT id, name, email, password FROM users WHERE email = ?",
      [normalizedEmail],
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const user = users[0];

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const token = generateToken(user);

    setAuthCookie(res, token);

    return res.status(200).json({
      message: "Login successful.",
      user: publicUser(user),
    });
  } catch (error) {
    next(error);
  }
};

// GET CURRENT USER
exports.getMe = async (req, res, next) => {
  try {
    const [users] = await pool.execute(
      "SELECT id, name, email FROM users WHERE id = ?",
      [req.user.userId],
    );

    if (users.length === 0) {
      res.clearCookie("accessToken", { path: "/" });

      return res.status(401).json({
        message: "User no longer exists.",
      });
    }

    return res.status(200).json({
      user: users[0],
    });
  } catch (error) {
    next(error);
  }
};

// LOGOUT
exports.logout = (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.status(200).json({
    message: "Logged out successfully.",
  });
};

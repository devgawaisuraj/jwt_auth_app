const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    message: "JWT Authentication API is running.",
  });
});

app.use("/api/auth", authRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Internal server error.",
  });
});

module.exports = app;

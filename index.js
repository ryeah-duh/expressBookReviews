const express = require("express");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const { general } = require("./routes/general");
const { authenticated, isValid, users } = require("./routes/auth_users");

const app = express();
const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || "development-session-secret",
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 }
}));

app.post("/register", (req, res) => {
  const { username, password } = req.body || {};
  if (typeof username !== "string" || typeof password !== "string" || !username.trim() || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username.trim())) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username: username.trim(), password });
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

function requireAuth(req, res, next) {
  const bearer = req.headers.authorization?.startsWith("Bearer ")
    ? req.headers.authorization.slice(7)
    : null;
  const token = bearer || req.session.authorization?.accessToken;
  if (!token) return res.status(401).json({ message: "Authentication required" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    return next();
  } catch (_error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

app.use("/customer", (req, res, next) => {
  if (req.path === "/login") return next();
  return requireAuth(req, res, next);
}, authenticated);
app.use("/", general);

app.use((_req, res) => res.status(404).json({ message: "Route not found" }));

if (require.main === module) {
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, () => console.log(`Bookstore API listening on http://localhost:${port}`));
}

module.exports = app;

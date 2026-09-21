const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("../booksdb");

const regd_users = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || "development-only-change-me";

const isValid = (username) => users.some((user) => user.username === username);
const authenticatedUser = (username, password) =>
  users.some((user) => user.username === username && user.password === password);

regd_users.post("/login", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid login. Check username and password" });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({ message: "User successfully logged in", accessToken });
});

const locks = new Map();
async function withBookLock(isbn, action) {
  const previous = locks.get(isbn) || Promise.resolve();
  let release;
  const current = new Promise((resolve) => { release = resolve; });
  locks.set(isbn, current);
  await previous;
  try {
    return await action();
  } finally {
    release();
    if (locks.get(isbn) === current) locks.delete(isbn);
  }
}

regd_users.put("/auth/review/:isbn", async (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review ?? req.body?.review;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (typeof review !== "string" || !review.trim()) {
    return res.status(400).json({ message: "A non-empty review is required" });
  }

  const username = req.user.username;
  const reviews = await withBookLock(isbn, async () => {
    books[isbn].reviews ||= {};
    books[isbn].reviews[username] = review.trim();
    return { ...books[isbn].reviews };
  });
  return res.status(200).json({ message: "Review successfully posted", reviews });
});

regd_users.delete("/auth/review/:isbn", async (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  const username = req.user.username;
  const deleted = await withBookLock(isbn, async () => {
    if (!books[isbn].reviews || !(username in books[isbn].reviews)) return false;
    delete books[isbn].reviews[username];
    return true;
  });
  return deleted
    ? res.status(200).json({ message: "Review successfully deleted" })
    : res.status(404).json({ message: "No review by this user was found" });
});

module.exports = { authenticated: regd_users, isValid, users };

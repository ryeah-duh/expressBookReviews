const express = require("express");
const axios = require("axios");
const books = require("../booksdb");

const public_users = express.Router();

const normalized = (value) => String(value || "").trim().toLowerCase();

public_users.get("/", (_req, res) => res.status(200).json(books));

public_users.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book)
    : res.status(404).json({ message: "Book not found" });
});

public_users.get("/author/:author", (req, res) => {
  const author = normalized(req.params.author);
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => normalized(book.author) === author)
  );
  return res.status(200).json(matches);
});

public_users.get("/title/:title", (req, res) => {
  const title = normalized(req.params.title);
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) => normalized(book.title) === title)
  );
  return res.status(200).json(matches);
});

public_users.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.status(200).json(book.reviews || {})
    : res.status(404).json({ message: "Book not found" });
});

/*
 * Task 11: Promise/async Axios implementations.
 * These functions can be imported independently. Set BOOK_API_URL when the
 * server is not running at http://localhost:5000.
 */
const api = () => axios.create({
  baseURL: process.env.BOOK_API_URL || "http://localhost:5000",
  timeout: 5000
});

async function getAllBooks() {
  const response = await api().get("/");
  return response.data;
}

function getBookByISBN(isbn) {
  return api().get(`/isbn/${encodeURIComponent(isbn)}`).then((response) => response.data);
}

async function getBooksByAuthor(author) {
  const response = await api().get(`/author/${encodeURIComponent(author)}`);
  return response.data;
}

async function getBooksByTitle(title) {
  const response = await api().get(`/title/${encodeURIComponent(title)}`);
  return response.data;
}

module.exports = {
  general: public_users,
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle
};

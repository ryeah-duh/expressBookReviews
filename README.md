# Express Book Review

A server-side online bookstore API built with Node.js and Express. It supports listing and searching books, user registration/login, review management, JWT/session authentication, and serialized concurrent writes per ISBN.

## Run

```bash
npm install
npm start
```

The server starts at `http://localhost:5000`. See `curl-commands.md` for all assessment evidence commands.

## API

| Method | Route | Purpose |
|---|---|---|
| GET | `/` | Retrieve all books |
| GET | `/isbn/:isbn` | Find a book by ISBN |
| GET | `/author/:author` | Find books by exact author, case-insensitive |
| GET | `/title/:title` | Find books by exact title, case-insensitive |
| GET | `/review/:isbn` | Retrieve a book's reviews |
| POST | `/register` | Register a user |
| POST | `/customer/login` | Log in |
| PUT | `/customer/auth/review/:isbn` | Add/update the logged-in user's review |
| DELETE | `/customer/auth/review/:isbn` | Delete the logged-in user's review |

## Data source

`booksdb.js` uses the same ISBN-keyed object shape as the course starter project. Replace its exported object with the evaluator-provided data if required. Reviews live under each book's `reviews` object.

## Notes

- Review updates are scoped to the authenticated username.
- A small per-ISBN promise lock serializes overlapping writes.
- The in-memory users and reviews reset when the process restarts, matching the course starter architecture.
- Set secure `JWT_SECRET` and `SESSION_SECRET` environment variables outside coursework/demo use.

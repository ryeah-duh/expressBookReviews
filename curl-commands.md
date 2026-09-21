# Assessment cURL evidence

Run `npm install` and `npm start`, then execute each command in a second terminal. Copy each command together with its real output into the submission field/screenshot named below.

## Task 1 — `githubrepo`

Fork the upstream repository in GitHub first. Replace `YOUR_GITHUB_USERNAME`:

```bash
curl -s https://api.github.com/repos/YOUR_GITHUB_USERNAME/expressBookReview
```

The genuine output must include:

```json
"fork": true,
"parent": { "full_name": "ibm-developer-skills-network/expressBookReview" }
```

## Task 2 — `getallbooks`

```bash
curl -s http://localhost:5000/
```

## Task 3 — `getbooksbyISBN`

```bash
curl -s http://localhost:5000/isbn/1
```

## Task 4 — `getbooksbyauthor`

```bash
curl -s "http://localhost:5000/author/Chinua%20Achebe"
```

## Task 5 — `getbooksbytitle`

```bash
curl -s "http://localhost:5000/title/Things%20Fall%20Apart"
```

## Task 6 — `getbookreview`

```bash
curl -s http://localhost:5000/review/1
```

## Task 7 — `register`

```bash
curl -s -X POST http://localhost:5000/register -H "Content-Type: application/json" -d '{"username":"aarya","password":"test123"}'
```

## Task 8 — `login`

Save cookies so the next two commands stay logged in:

```bash
curl -s -c cookies.txt -X POST http://localhost:5000/customer/login -H "Content-Type: application/json" -d '{"username":"aarya","password":"test123"}'
```

## Task 9 — `reviewadded`

```bash
curl -s -b cookies.txt -X PUT "http://localhost:5000/customer/auth/review/1?review=Excellent%20book"
```

## Task 10 — `deletereview`

```bash
curl -s -b cookies.txt -X DELETE http://localhost:5000/customer/auth/review/1
```

## Task 11 — `general.js` URL

After pushing to GitHub, submit:

```text
https://github.com/YOUR_GITHUB_USERNAME/expressBookReview/blob/main/routes/general.js
```

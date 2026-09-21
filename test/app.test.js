const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");
const app = require("../index");

test("book search, auth, and review lifecycle", async () => {
  const all = await request(app).get("/").expect(200);
  assert.ok(all.body["1"]);
  await request(app).get("/isbn/1").expect(200);
  await request(app).get("/author/Chinua%20Achebe").expect(200);
  await request(app).get("/title/Things%20Fall%20Apart").expect(200);
  await request(app).get("/review/1").expect(200, {});

  await request(app).post("/register").send({ username: "aarya", password: "test123" }).expect(201);
  const login = await request(app).post("/customer/login").send({ username: "aarya", password: "test123" }).expect(200);
  const auth = { Authorization: `Bearer ${login.body.accessToken}` };
  await request(app).put("/customer/auth/review/1").set(auth).query({ review: "Excellent book" }).expect(200);
  await request(app).delete("/customer/auth/review/1").set(auth).expect(200);
});

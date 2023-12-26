const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

beforeAll(async () => {
  const userData = require("../data/user.json").map((user) => {
    return {
      ...user,
      email: "transaction_" + user.email,
      password: hashPassword(user.password),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Users", userData);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Users", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("POST /transaction", () => {
  it("generate midtrans success", async () => {
    //login first
    const loginInput = {
      email: "transaction_khosy@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .post("/transaction")
      .set("access_token", resLogin.body.data.access_token);
    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("generate midtrans user not found", async () => {
    const res = await request(app)
      .post("/transaction")
      .set(
        "access_token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJ1c2VyVXNlcm5hbWUiOiJQdXRyYSIsInVzZXJFbWFpbCI6InB1dHJhQGdtYWlsLmNvbSIsInVzZXJQcmVtaXVtIjpmYWxzZSwidXNlclBvaW50IjowLCJ1c2VyUHJvZmlsZVBpY3QiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMbExyUk5EVzJGMTctWG9oZmRNVjc3R21BUm1TR3FlZThMaWdsb011TDFlY0U9czM2MC1jLW5vIiwiaWF0IjoxNzAwMTIzMDU1fQ.suhRnrWIM5Y5gfwMOgujoBlqBOKrp8s9HdP9QJUzGQs"
      );
    expect(res.status).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "Email or Password Invalid");
  });
});

describe("PATCH /transaction", () => {
  it("make user premium success", async () => {
    //login first
    const loginInput = {
      email: "transaction_khosy@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .patch("/transaction")
      .set("access_token", resLogin.body.data.access_token);
    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("access_token", expect.any(String));
  });

  it("make user premium user not found", async () => {
    const res = await request(app)
      .patch("/transaction")
      .set(
        "access_token",
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjUwLCJ1c2VyVXNlcm5hbWUiOiJQdXRyYSIsInVzZXJFbWFpbCI6InB1dHJhQGdtYWlsLmNvbSIsInVzZXJQcmVtaXVtIjpmYWxzZSwidXNlclBvaW50IjowLCJ1c2VyUHJvZmlsZVBpY3QiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NMbExyUk5EVzJGMTctWG9oZmRNVjc3R21BUm1TR3FlZThMaWdsb011TDFlY0U9czM2MC1jLW5vIiwiaWF0IjoxNzAwMTIzMDU1fQ.suhRnrWIM5Y5gfwMOgujoBlqBOKrp8s9HdP9QJUzGQs"
      );
    expect(res.status).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "Email or Password Invalid");
  });
});

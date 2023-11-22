const request = require("supertest");
const app = require("../app");
const { User } = require("../models/index");

beforeAll(async () => {
  await User.create({
    username: "test",
    email: "test@mail.com",
    password: "12345",
    phoneNumber: "08123205468",
    address: "Jl. Sudah duluan",
  });
});

afterAll(async () => {
  await User.destroy({
    where: {},
    restartIdentity: true,
  });
});

describe("POST /login", () => {
  it("User login success", async () => {
    const loginInput = {
      email: "test@mail.com",
      password: "12345",
    };
    const res = await request(app).post("/login").send(loginInput);

    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    // expect(res.body).toHaveProperty("data");
    expect(res.body).toHaveProperty("access_token");
    // expect(res.body.data).toHaveProperty("userUsername", "test");
  });

  it("User login wrong pass", async () => {
    const loginInput = {
      email: "test@mail.com",
      password: "23516",
    };
    const res = await request(app).post("/login").send(loginInput);

    expect(res.status).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "Email or Password Invalid");
  });

  it("User login wrong email", async () => {
    const loginInput = {
      email: "test12356@mail.com",
      password: "12345",
    };
    const res = await request(app).post("/login").send(loginInput);

    expect(res.status).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "Email or Password Invalid");
  });
});

describe("GET /user", () => {
  it("get user detail success", async () => {
    //login first
    const loginInput = {
      email: "test@mail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/user")
      .set("access_token", resLogin.body.access_token);
    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("get user not found", async () => {
    const res = await request(app)
      .get("/user")
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

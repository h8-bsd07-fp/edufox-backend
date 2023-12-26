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
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("access_token");
    expect(res.body.data).toHaveProperty("userUsername", "test");
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

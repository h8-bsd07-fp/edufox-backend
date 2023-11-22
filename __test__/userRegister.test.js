const request = require("supertest");
const app = require("../app");
const { User } = require("../models/index");

beforeAll(async () => {
  await User.create({
    username: "test",
    email: "test@mail.com",
    password: "12345",
    phoneNumber: "08123205468",
    // address: "Jl. Sudah duluan",
    profilePicture:
      "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
  });
});

afterAll(async () => {
  await User.destroy({
    where: {},
    restartIdentity: true,
  });
});

describe("POST /register", () => {
  // describe("POST /register - success", () => {
  // });
  it("User register success", async () => {
    const payload = {
      username: "test123",
      email: "test123@gmail.com",
      password: "12345",
      phoneNumber: "08123506458",
      // address: "Jl. Tester No.404",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("data");
    expect(res.body.data).toHaveProperty("email", "test123@gmail.com");
    // console.log(res.body);
  });

  it("User Email already been used", async () => {
    const payload = {
      username: "test45",
      email: "test@mail.com",
      password: "12345",
      phoneNumber: "08123205468",
      // address: "Jl. Sudah duluan",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "email must be unique");
    // expect(res.body.message).toHaveProperty("email", "email is not unique");
  });

  it("No User Email", async () => {
    const payload = {
      username: "test no email",
      email: "",
      password: "12345",
      phoneNumber: "081234528975",
      // address: "Jl. Gak ada Email No.24",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "need email");
  });

  it("No User Email", async () => {
    const payload = {
      username: "test no email",
      password: "12345",
      phoneNumber: "081234528975",
      // address: "Jl. Gak ada Email No.24",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "need email");
  });

  it("The format is is not an email", async () => {
    const payload = {
      username: "its not an email",
      email: "notemail",
      password: "12345",
      phoneNumber: "08123504682",
      // address: "Jl. Bukan email No.25",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "email not valid");
  });

  it("No Password", async () => {
    const payload = {
      username: "Test not password",
      email: "nopass@gmail.com",
      password: "",
      phoneNumber: "081205468852",
      // address: "Jl. Nopass No.45",
      profilePicture:
        "https://lh3.googleusercontent.com/a/ACg8ocKQjy2vdcMUjngAU-LA7EU-1sirCeju3AqoDdo5CIXyYw=s432-c-no",
    };
    const res = await request(app).post("/register").send(payload);

    expect(res.status).toBe(400);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "need password");
  });

  //   it("Pass less than 5", async () => {
  //     const payload = {
  //       username: "less 5 pass",
  //       email: "tooshortpass@gmail.com",
  //       password: "123",
  //       phoneNumber: "08125046852",
  //       address: "Jl. Pass have to be No.5",
  //     };
  //     const res = await request(app).post("/register").send(payload);

  //     expect(res.status).toBe(400);
  //     expect(res.body).toBeInstanceOf(Object);
  //     expect(res.body).toHaveProperty(
  //       "message",
  //       "Validation len on password failed"
  //     );
  //   });
});

const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

beforeAll(async () => {
  const userData = require("../data/user.json").map((user) => {
    return {
      ...user,
      //   username: user.username,
      email: "enrollment_" + user.email,
      password: hashPassword(user.password),
      //   isPremium: user.isPremium,
      //   profilePicture: user.profilePicture,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Users", userData);

  const typeCategory = require("../data/category.json").map((category) => {
    return {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Categories", typeCategory);

  const courseData = require("../data/course.json").map((course) => {
    return {
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Courses", courseData);

  const chapterData = require("../data/chapter.json").map((chapter) => {
    return {
      ...chapter,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Chapters", chapterData);
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("Enrollments", null, {
      truncate: { cascade: true },
      restartIdentity: true,
    });
    await queryInterface.bulkDelete("Chapters", null, {
      truncate: { cascade: true },
      restartIdentity: true,
    });

    await queryInterface.bulkDelete("Courses", null, {
      truncate: { cascade: true },
      restartIdentity: true,
    });

    await queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });

    await queryInterface.bulkDelete("Users", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (error) {
    console.log(error, "<<< error after all");
  }
});

describe("GET /enrollments", () => {
  it("get enrollment success", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    const res = await request(app)
      .get("/enrollments")
      .set("access_token", resLogin.body.access_token);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });
});

describe("POST /enrollments/:courseId", () => {
  it("add enrollment success", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    // console.log(resLogin.body, "<<<<", 120);
    let courseId = 1;
    const enrollmentInput = {
      //   status: "onProgress",
      curChapterId: 3,
    };
    const res = await request(app)
      .post("/enrollments/" + courseId)
      .send(enrollmentInput)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("add enrollment enrollment already created", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    // console.log(resLogin.body, "<<<<", 120);
    let courseId = 1;
    const enrollmentInput = {
      //   status: "onProgress",
      curChapterId: 3,
    };
    const res = await request(app)
      .post("/enrollments/" + courseId)
      .send(enrollmentInput)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(403);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "You dont have the authorize");
  });

  it("add enrollment user not premium", async () => {
    //login first
    const loginInput = {
      email: "enrollment_khosy@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    // console.log(resLogin.body, "<<<<", 120);
    let courseId = 1;
    const enrollmentInput = {
      //   status: "onProgress",
      curChapterId: 3,
    };
    const res = await request(app)
      .post("/enrollments/" + courseId)
      .send(enrollmentInput)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(403);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "You dont have the authorize");
  });
});

describe("GET /enrollments/:courseId", () => {
  it("No enrollment found", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    let courseId = 1;
    const res = await request(app)
      .get("/enrollments/" + courseId)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("No enrollment found", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    let courseId = 500;
    const res = await request(app)
      .get("/enrollments/" + courseId)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "Data not found");
  });
});

describe("PATCH /enrollments/:courseId", () => {
  it("update enrollment success", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    // console.log(resLogin.body, "<<<<", 120);
    let courseId = 1;
    const enrollmentInput = {
      status: "onProgress",
      curChapterId: 4,
    };
    const res = await request(app)
      .patch("/enrollments/" + courseId)
      .send(enrollmentInput)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(201);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", expect.any(String));
  });

  it("update enrollment success", async () => {
    //login first
    const loginInput = {
      email: "enrollment_juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    // console.log(resLogin.body, "<<<<", 120);
    let courseId = 500;
    const enrollmentInput = {
      status: "onProgress",
      curChapterId: 4,
    };
    const res = await request(app)
      .patch("/enrollments/" + courseId)
      .send(enrollmentInput)
      .set("access_token", resLogin.body.access_token);
    // console.log(res.body, "<<<<", 109);
    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "Data not found");
  });
});

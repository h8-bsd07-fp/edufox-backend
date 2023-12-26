const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

beforeAll(async () => {
  try {
    const userData = require("../data/user.json").map((user) => {
      return {
        // ...user,
        email: user.email,
        password: hashPassword(user.password),
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
  } catch (err) {
    console.log(err, "<<<< beforeAll chapter");
  }
});

afterAll(async () => {
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
});

describe("GET /chapter/:chapterId", () => {
  it("get chapter details success", async () => {
    //login first
    const loginInput = {
      email: "juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    let chapterId = 1;
    const res = await request(app)
      .get("/chapter/" + chapterId)
      .set("access_token", resLogin.body.data.access_token);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("Get chapter no access token (not login first)", async () => {
    let chapterId = 1;
    const res = await request(app).get("/chapter/" + chapterId);
    expect(res.status).toBe(401);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "Invalid token");
  });

  it("No chapter found", async () => {
    //login first
    const loginInput = {
      email: "juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    let chapterId = 500;
    const res = await request(app)
      .get("/chapter/" + chapterId)
      .set("access_token", resLogin.body.data.access_token);
    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("message", "Data not found");
  });
});

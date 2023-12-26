const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;
const { Course } = require("../models/index");

beforeAll(async () => {
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
});

afterAll(async () => {
  try {
    await queryInterface.bulkDelete("Courses", null, {
      truncate: { cascade: true },
      restartIdentity: true,
    });

    await queryInterface.bulkDelete("Categories", null, {
      truncate: true,
      cascade: true,
      restartIdentity: true,
    });
  } catch (err) {
    console.log(err, "<<< afterAll course");
  }
});

describe("GET /course", () => {
  it("Get course success", async () => {
    const res = await request(app).get("/course");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("data", expect.any(Array));
  });
});

describe("GET /course/:courseId", () => {
  it("Get course with parameter id success", async () => {
    let courseId = 1;
    const res = await request(app).get("/course/" + courseId);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });

  it("Get course with parameter id not found", async () => {
    let courseId = 50;
    const res = await request(app).get("/course/" + courseId);
    expect(res.status).toBe(404);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("message", "Data not found");
  });
});

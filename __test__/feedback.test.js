const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { hashPassword } = require("../helpers/bcrypt");
const { queryInterface } = sequelize;

beforeAll(async () => {
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
});

afterAll(async () => {
  try {
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
  } catch (err) {
    console.log(err, "<<<<< afterAll feedback");
  }
});

describe("POST /feedback/:courseId", () => {
  it("create feedback success", async () => {
    //login first
    const loginInput = {
      email: "juan@gmail.com",
      password: "12345",
    };
    const resLogin = await request(app).post("/login").send(loginInput);
    expect(resLogin.status).toBe(200);
    let courseId = 1;
    const feedbackInput = {
      rating: 100,
      comment:
        "Penjelasan pada video sudah cukup jelas akan tetapi akan lebih baik bila lebih improve lagi.",
    };
    const res = await request(app)
      .post("/feedback/" + courseId)
      .send(feedbackInput)
      .set("access_token", resLogin.body.data.access_token);
    // console.log(res.body, "<<<<", 90);
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    // console.log(res.body, "<<<<<");
    expect(res.body).toHaveProperty("data", expect.any(Object));
  });
});

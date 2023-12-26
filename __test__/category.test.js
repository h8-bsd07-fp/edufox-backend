const request = require("supertest");
const app = require("../app");
const { sequelize } = require("../models/index");
const { queryInterface } = sequelize;

beforeAll(async () => {
  const typeCategory = require("../data/category.json").map((category) => {
    return {
      ...category,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  });
  await queryInterface.bulkInsert("Categories", typeCategory);
});

afterAll(async () => {
  await queryInterface.bulkDelete("Categories", null, {
    truncate: true,
    cascade: true,
    restartIdentity: true,
  });
});

describe("GET /categories", () => {
  it("Get course category", async () => {
    const res = await request(app).get("/categories");
    expect(res.status).toBe(200);
    expect(res.body).toBeInstanceOf(Object);
    expect(res.body).toHaveProperty("data", expect.any(Array));
  });
});

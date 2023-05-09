const request = require("supertest");
const { app, serverInstance } = require("../index");
const { redisClient } = require("../controllers/serverController");

afterAll(async () => {
  await new Promise((resolve) => setTimeout(() => resolve(), 500));
  serverInstance.close();
  redisClient.quit();
});

describe("Test Express server", () => {
  it("GET / should return 200", async () => {
    const response = await request(app).get("/");
    expect(response.status).toBe(200);
  });
});

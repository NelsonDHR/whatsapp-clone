const request = require("supertest");
const { app, redisClient, serverInstance } = require("../index");

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

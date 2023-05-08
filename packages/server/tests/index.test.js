const request = require("supertest");
const authRouter = require("../routers/authRouter");
const app = require("../index");
const server = app.listen(3001);
const Redis = require("ioredis");
let redisClient;


describe("GET /", () => {
  
  afterEach(() => {
    redisClient.flushall();
  });

  afterAll(() => {
    redisClient.quit();
  });

  it('should return "Hello World"', async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toContain("Hello World");
  });

  

  // Cierra el servidor después de ejecutar todas las pruebas
  afterAll(async () => {
    await server.close();
    await app.close();
  });
});

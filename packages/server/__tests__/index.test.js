const request = require("supertest");
const { app, serverInstance } = require("../index");
const { redisClient } = require("../controllers/serverController");
const io = require('socket.io-client');

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

describe('Test socket.io connection', () => {
  let socket;

  beforeEach((done) => {
    socket = io(`http://localhost:${serverInstance.address().port}`);
    socket.on('connect', done);
  });

  afterEach(() => {
    if (socket.connected) {
      socket.disconnect();
    }
  });

  it('should connect to the socket.io server', (done) => {
    expect(socket.connected).toBeTruthy();
    done();
  });
});
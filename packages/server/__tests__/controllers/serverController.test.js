const serverController = require("../../controllers/serverController");
const session = require("express-session");
const RedisStore = require("connect-redis").default;

jest.mock("express-session");
jest.mock("connect-redis");
jest.mock('../../redis', () => ({
  multi: jest.fn().mockReturnThis(),
  incr: jest.fn().mockReturnThis(),
  expire: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([[null, 1]])
}));

describe("serverController", () => {

	describe("sessionMiddleware", () => {
		test("should create a session middleware with the correct options", () => {
			expect(session).toHaveBeenCalledWith({
				secret: expect.any(String),
				credentials: true,
				name: "sid",
				store: expect.any(RedisStore),
				resave: false,
				saveUninitialized: false,
				cookie: {
					secure: expect.any(String),
					httpOnly: true,
					expires: 1000 * 60 * 60 * 24 * 7,
					sameSite: expect.any(String),
				},
			});
		});
	});

	describe("wrap", () => {
		test("should return a function that calls the express middleware with the socket request and an empty response object", () => {
			const mockMiddleware = jest.fn();
			const mockSocket = { request: {} };
			const mockNext = jest.fn();
			const wrappedMiddleware = serverController.wrap(mockMiddleware);
			wrappedMiddleware(mockSocket, mockNext);
			expect(mockMiddleware).toHaveBeenCalledWith(
				mockSocket.request,
				{},
				mockNext
			);
		});
	});

	describe("corsConfig", () => {
		test("should have the correct cors configuration", () => {
			expect(serverController.corsConfig).toEqual({
				origin: "http://localhost:8080",
				credentials: true,
			});
		});
	});
});

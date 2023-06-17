const attemptLogin = require("../controllers/express/attemptLogin");
const pool = require("../db-connection");
const bcrypt = require("bcrypt");
const { jwtSign } = require("../controllers/jwt/jwtAuth");
require("dotenv").config();

const jwt = require("jsonwebtoken");

jest.mock("../db-connection"); // Mock para el módulo pool
jest.mock("jsonwebtoken"); // Mock para el módulo jwt
jest.mock("bcrypt"); // Mock para el módulo bcrypt
jest.mock("../controllers/jwt/jwtAuth"); // Mock para el módulo jwtAuth

describe("attemptLogin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return loggedIn:true and a token when the login attempt is successful", async () => {
    // Mock para el caso exitoso de inicio de sesión
    const mockReq = {
      body: { username: "testuser", password: "testpassword" },
    };
    const mockRes = { json: jest.fn() };

    // Mock para la consulta a la base de datos
    const mockPoolQuery = jest.spyOn(pool, "query").mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: 1,
          username: "testuser",
          passhash:
            "$2b$10$zJZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7f",
          userid: 123,
        },
      ],
    });

    // Mock para la comparación de contraseñas
    const mockBcryptCompare = jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValueOnce(true);

    // Mock para la función jwtSign
    const mockJwtSign = jest
      .spyOn({ jwtSign }, "jwtSign")
      .mockResolvedValueOnce("testtoken");

    await attemptLogin(mockReq, mockRes);

    expect(mockPoolQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
      ["testuser"]
    );
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      "testpassword",
      "$2b$10$zJZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7f"
    );
    expect(mockJwtSign).toHaveBeenCalledWith(
      { username: "testuser", id: 1, userid: 123 },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    expect(mockRes.json).toHaveBeenCalledWith({
      loggedIn: true,
      token: "testtoken",
    });

    // Restaurar los mocks
    mockPoolQuery.mockRestore();
    mockBcryptCompare.mockRestore();
    mockJwtSign.mockRestore();
  });

  //Tests that a user with incorrect password cannot log in
  it("test_happy_path_incorrect_password", async () => {
    const req = { body: { username: "testuser", password: "wrongpassword" } };
    const res = { json: jest.fn() };
    const mockPoolQuery = jest.spyOn(pool, "query").mockResolvedValueOnce({
      rowCount: 1,
      rows: [
        {
          id: 1,
          username: "testuser",
          passhash:
            "$2b$10$zJZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7f",
          userid: 123,
        },
      ],
    });
    const mockBcryptCompare = jest
      .spyOn(bcrypt, "compare")
      .mockResolvedValueOnce(false);

    await attemptLogin(req, res);

    expect(mockPoolQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
      ["testuser"]
    );
    expect(mockBcryptCompare).toHaveBeenCalledWith(
      "wrongpassword",
      "$2b$10$zJZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7fZz5yJ8jv7f"
    );
    expect(res.json).toHaveBeenCalledWith({
      loggedIn: false,
      status: "Wrong username or password!",
    });

    mockPoolQuery.mockRestore();
    mockBcryptCompare.mockRestore();
  });

  // Tests that a user that does not exist cannot log in
  it("test_edge_case_user_not_found", async () => {
    const req = {
      body: { username: "nonexistentuser", password: "testpassword" },
    };
    const res = { json: jest.fn() };
    const mockPoolQuery = jest.spyOn(pool, "query").mockResolvedValueOnce({
      rowCount: 0,
      rows: [],
    });

    await attemptLogin(req, res);

    expect(mockPoolQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash, userid FROM users u WHERE u.username=$1",
      ["nonexistentuser"]
    );
    expect(res.json).toHaveBeenCalledWith({
      loggedIn: false,
      status: "Wrong username or password!",
    });

    mockPoolQuery.mockRestore();
  });

  
});

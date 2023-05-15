const authController = require('../../controllers/authController');
const pool = require('../../db-connection');
const bcrypt = require("bcrypt");

describe('handleLogin', () => {
  it('should return {loggedIn: true, username} when there is a user in the session', () => {
    const req = {
      session: {
        user: {
          username: 'testuser'
        }
      }
    };
    const res = {
      json: jest.fn()
    };
    authController.handleLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({loggedIn: true, username: 'testuser'});
  });

  it('should return {loggedIn: false} when there is no user in the session', () => {
    const req = {
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    authController.handleLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({loggedIn: false});
  });
});

describe('attempLogin', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return {loggedIn: true, username} when login is successful', async () => {
    // Arrange
    const req = {
      body: {
        username: 'testuser',
        password: 'password'
      },
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    const mockQuery = jest.spyOn(pool, 'query').mockResolvedValue({
      rowCount: 1,
      rows: [{
        id: 1,
        username: 'testuser',
        passhash: await bcrypt.hash('password', 10)
      }]
    });

    // Act
    await authController.attempLogin(req, res);

    // Assert
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      ['testuser']
    );
    expect(res.json).toHaveBeenCalledWith({loggedIn: true, username: 'testuser'});
    expect(req.session.user).toEqual({username: 'testuser', id: 1});
  });

  it('should return {loggedIn: false, status: "Wrong username or password"} when username is wrong', async () => {
    // Arrange
    const req = {
      body: {
        username: 'wronguser',
        password: 'password'
      },
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    const mockQuery = jest.spyOn(pool, 'query').mockResolvedValue({
      rowCount: 0,
      rows: []
    });

    // Act
    await authController.attempLogin(req, res);

    // Assert
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      ['wronguser']
    );
    expect(res.json).toHaveBeenCalledWith({loggedIn: false, status: 'Wrong username or password'});
    expect(req.session.user).toBeUndefined();
  });

  it('should return {loggedIn: false, status: "Wrong username or password"} when password is wrong', async () => {
    // Arrange
    const req = {
      body: {
        username: 'testuser',
        password: 'wrongpassword'
      },
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    const mockQuery = jest.spyOn(pool, 'query').mockResolvedValue({
      rowCount: 1,
      rows: [{
        id: 1,
        username: 'testuser',
        passhash: await bcrypt.hash('password', 10)
      }]
    });

    // Act
    await authController.attempLogin(req, res);

    // Assert
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT id, username, passhash FROM users u WHERE u.username=$1",
      ['testuser']
    );
    expect(res.json).toHaveBeenCalledWith({loggedIn: false, status: 'Wrong username or password'});
    expect(req.session.user).toBeUndefined();
  });
});

describe('attempRegister', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should register the user and return {loggedIn: true, username} when username is available', async () => {
    // Arrange
    const req = {
      body: {
        username: 'testuser',
        password: 'password'
      },
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    const mockQuery = jest.spyOn(pool, 'query').mockImplementation((query, params) => {
      if (query === "SELECT username FROM users WHERE username=$1" && params[0] === 'testuser') {
        return {
          rowCount: 0,
          rows: []
        };
      } else if (query === "INSERT INTO users(username, passhash) values($1,$2) RETURNING id, username" && params[0] === 'testuser') {
        return {
          rowCount: 1,
          rows: [{
            id: 1,
            username: 'testuser'
          }]
        };
      }
    });

    // Act
    await authController.attempRegister(req, res);

    // Assert
    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT username FROM users WHERE username=$1",
      ['testuser']
    );
    expect(mockQuery).toHaveBeenCalledWith(
      "INSERT INTO users(username, passhash) values($1,$2) RETURNING id, username",
      ['testuser', expect.any(String)]
    );
    expect(res.json).toHaveBeenCalledWith({loggedIn: true, username: 'testuser'});
    expect(req.session.user).toEqual({username: 'testuser', id: 1});
  });

  it('should return {loggedIn: false, status: "Username taken"} when username is not available', async () => {
    // Arrange
    const req = {
      body: {
        username: 'testuser',
        password: 'password'
      },
      session: {}
    };
    const res = {
      json: jest.fn()
    };
    const mockQuery = jest.spyOn(pool, 'query').mockResolvedValue({
      rowCount: 1,
      rows: [{
        username: 'testuser'
      }]
    });

    // Act
    await authController.attempRegister(req, res);

    // Assert
    expect(mockQuery).toHaveBeenCalledWith(
      "SELECT username FROM users WHERE username=$1",
      ['testuser']
    );
    expect(res.json).toHaveBeenCalledWith({loggedIn: false, status: 'Username taken'});
    expect(req.session.user).toBeUndefined();
  });
});
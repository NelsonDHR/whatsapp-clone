const pool = require('.././db-connection');
const bcrypt = require('bcrypt');
const { jwtSign } = require('../controllers/jwt/jwtAuth');
const attemptRegister = require('../controllers/express/attemptRegister');

jest.mock('.././db-connection');
jest.mock('bcrypt');
jest.mock('../controllers/jwt/jwtAuth');

describe('attemptRegister', () => {
  let req, res;

  beforeEach(() => {
    req = { body: { username: 'test', password: 'password' } };
    res = { json: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return loggedIn false and status Username taken if user already exists', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 1 });
    await attemptRegister(req, res);
    expect(res.json).toHaveBeenCalledWith({ loggedIn: false, status: 'Username taken' });
  });

  test('should return loggedIn true and token if user is successfully registered', async () => {
    pool.query.mockResolvedValueOnce({ rowCount: 0 });
    bcrypt.hash.mockResolvedValueOnce('hashed_password');
    pool.query.mockResolvedValueOnce({
      rows: [{ id: 1, username: 'test', userid: 'uuid' }],
    });
    jwtSign.mockResolvedValueOnce('valid_token');
    await attemptRegister(req, res);
    expect(res.json).toHaveBeenCalledWith({ loggedIn: true, token: 'valid_token' });
  });
});
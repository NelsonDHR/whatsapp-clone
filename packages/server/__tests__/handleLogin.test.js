const handleLogin = require('../controllers/express/handleLogin');
const { jwtVerify, getJwt } = require('../controllers/jwt/jwtAuth');
const pool = require('.././db-connection');
require('dotenv').config();

jest.mock('../controllers/jwt/jwtAuth');
jest.mock('.././db-connection');

describe('handleLogin', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = { json: jest.fn() };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return loggedIn false if no token is provided', async () => {
    getJwt.mockReturnValueOnce(null);
    await handleLogin(req, res);
    expect(res.json).toHaveBeenCalledWith({ loggedIn: false });
  });

  test('should return loggedIn false if user is not found in database', async () => {
    getJwt.mockReturnValueOnce('valid_token');
    jwtVerify.mockResolvedValueOnce({ username: 'test' });
    pool.query.mockResolvedValueOnce({ rowCount: 0 });
    await handleLogin(req, res);
    expect(res.json).not.toHaveBeenCalledWith({ loggedIn: false, token: null });
  });

  test('should return loggedIn true and token if user is found in database', async () => {
    getJwt.mockReturnValueOnce('valid_token');
    jwtVerify.mockResolvedValueOnce({ username: 'test' });
    pool.query.mockResolvedValueOnce({ rows: [{ username: 'test' }], rowCount: 1 });
    await handleLogin(req, res);
    expect(res.json).not.toHaveBeenCalledWith({ loggedIn: true, token: 'valid_token' });
  });
});
const { jwtVerify } = require('../controllers/jwt/jwtAuth');
const authorizeUser = require('../controllers/socketio/authorizeUser');

jest.mock('../controllers/jwt/jwtAuth');

describe('authorizeUser', () => {
  let socket, next;

  beforeEach(() => {
    socket = { handshake: { auth: { token: 'test' } } };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next with no arguments if token is valid', async () => {
    jwtVerify.mockResolvedValueOnce({ username: 'test' });
    await authorizeUser(socket, next);
    expect(next).toHaveBeenCalledWith();
    expect(socket.user).toEqual({ username: 'test' });
  });

  test('should call next with Error if token is invalid', async () => {
    jwtVerify.mockRejectedValueOnce(new Error());
    await authorizeUser(socket, next);
    expect(next).not.toHaveBeenCalledWith(new Error('Not authorized'));
  });
});
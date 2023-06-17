const redisClient = require('../../server/redis');
const rateLimiter = require('../controllers/express/rateLimiter');

jest.mock('../../server/redis', () => ({
  multi: jest.fn().mockReturnThis(),
  incr: jest.fn().mockReturnThis(),
  expire: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([[null, 1]]),
}));

describe('rateLimiter', () => {
  let req, res, next;

  beforeEach(() => {
    req = { headers: {}, connection: { remoteAddress: 'test' } };
    res = { json: jest.fn() };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call next if limit is not exceeded', async () => {
    const middleware = rateLimiter(60, 10);
    await middleware(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should send response if limit is exceeded', async () => {
    redisClient.exec.mockResolvedValueOnce([[null, 11]]);
    const middleware = rateLimiter(60, 10);
    await middleware(req, res, next);
    expect(res.json).toHaveBeenCalledWith({
      loggedIn: false,
      status: 'Slow down!! Try again in a minute.',
    });
  });
});
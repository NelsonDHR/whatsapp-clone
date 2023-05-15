const { rateLimiter } = require('../../controllers/rateLimiter');
const redisClient = require('../../redis');

jest.mock('../../redis', () => ({
  multi: jest.fn().mockReturnThis(),
  incr: jest.fn().mockReturnThis(),
  expire: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([[null, 1]])
}));

describe('rateLimiter', () => {
  const secondsLimit = 10;
  const limitAmount = 5;
  const middleware = rateLimiter(secondsLimit, limitAmount);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call next if the number of requests is within the limit', async () => {
    const req = { connection: { remoteAddress: '127.0.0.1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it('should return an error if the number of requests exceeds the limit', async () => {
    redisClient.exec.mockResolvedValueOnce([[null, limitAmount + 1]]);

    const req = { connection: { remoteAddress: '127.0.0.1' } };
    const res = { json: jest.fn() };
    const next = jest.fn();

    await middleware(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({
      loggedIn: false,
      status: 'Too many requests'
    });
  });
});
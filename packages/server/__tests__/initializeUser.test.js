const redisClient = require('../redis');
const parseFriendList = require('../controllers/socketio/parseFriendList');
const initializeUser = require('../controllers/socketio/initializeUser');

jest.mock('../redis', () => ({
  hset: jest.fn(),
  lrange: jest.fn(),
}));
jest.mock('../controllers/socketio/parseFriendList');

describe('initializeUser', () => {
  let socket;

  beforeEach(() => {
    socket = {
      user: { userid: 'test', username: 'test' },
      join: jest.fn(),
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call emit with messages if user has messages', async () => {
    redisClient.lrange.mockResolvedValueOnce([]);
    parseFriendList.mockResolvedValueOnce([]);
    redisClient.lrange.mockResolvedValueOnce(['friend.test.hello']);
    await initializeUser(socket);
    expect(socket.emit).toHaveBeenCalledWith('messages', [
      { to: 'friend', from: 'test', content: 'hello' },
    ]);
  });
});
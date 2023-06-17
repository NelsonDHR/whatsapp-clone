const redisClient = require('../redis');
const parseFriendList = require('../controllers/socketio/parseFriendList');
const onDisconnect = require('../controllers/socketio/onDisconnect');

jest.mock('../redis', () => ({
  hset: jest.fn(),
  lrange: jest.fn(),
}));
jest.mock('../controllers/socketio/parseFriendList');

describe('onDisconnect', () => {
  let socket;

  beforeEach(() => {
    socket = {
      user: { username: 'test' },
      to: jest.fn().mockReturnThis(),
      emit: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call hset and emit if user is successfully disconnected', async () => {
    redisClient.lrange.mockResolvedValueOnce(['friend.uuid']);
    parseFriendList.mockResolvedValueOnce([{ userid: 'uuid' }]);
    await onDisconnect(socket);
    expect(redisClient.hset).toHaveBeenCalledWith(
      'userid:test',
      'connected',
      false
    );
    expect(socket.to).toHaveBeenCalledWith(['uuid']);
    expect(socket.emit).toHaveBeenCalledWith('connected', false, 'test');
  });
});
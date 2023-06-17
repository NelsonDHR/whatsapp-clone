const redisClient = require('../redis');
const dm = require('../controllers/socketio/dm');

jest.mock('../redis', () => ({
  lpush: jest.fn(),
}));

describe('dm', () => {
  let socket, message;

  beforeEach(() => {
    socket = { user: { userid: 'test' }, to: jest.fn().mockReturnThis(), emit: jest.fn() };
    message = { to: 'friend', content: 'hello' };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call lpush and emit if message is valid', async () => {
    await dm(socket, message);
    expect(redisClient.lpush).toHaveBeenCalledWith(
      'chat:test',
      'friend.test.hello'
    );
    expect(redisClient.lpush).toHaveBeenCalledWith(
      'chat:friend',
      'friend.test.hello'
    );
    expect(socket.to).toHaveBeenCalledWith('friend');
    expect(socket.emit).toHaveBeenCalledWith('dm', {
      to: 'friend',
      content: 'hello',
      from: 'test',
    });
  });
});
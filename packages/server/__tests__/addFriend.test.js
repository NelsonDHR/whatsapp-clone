const redisClient = require('../redis');
const addFriend = require('../controllers/socketio/addFriend');

jest.mock('../redis', () => ({
  hgetall: jest.fn(),
  lrange: jest.fn(),
  lpush: jest.fn(),
}));

describe('addFriend', () => {
  let socket, cb;

  beforeEach(() => {
    socket = { user: { username: 'test' } };
    cb = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should call cb with done false and errorMsg Cannot add self! if friendName is the same as socket.user.username', async () => {
    await addFriend(socket, 'test', cb);
    expect(cb).toHaveBeenCalledWith({ done: false, errorMsg: 'Cannot add self!' });
  });

  test('should call cb with done false and errorMsg User does not exist! if friend does not exist', async () => {
    redisClient.hgetall.mockResolvedValueOnce({});
    await addFriend(socket, 'friend', cb);
    expect(cb).toHaveBeenCalledWith({ done: false, errorMsg: "User doesn't exist!" });
  });

  test('should call cb with done false and errorMsg Friend already added! if friend is already in friend list', async () => {
    redisClient.hgetall.mockResolvedValueOnce({ userid: 'uuid' });
    redisClient.lrange.mockResolvedValueOnce(['friend.uuid']);
    await addFriend(socket, 'friend', cb);
    expect(cb).toHaveBeenCalledWith({ done: false, errorMsg: 'Friend already added!' });
  });

  test('should call cb with done true and newFriend if friend is successfully added', async () => {
    redisClient.hgetall.mockResolvedValueOnce({ userid: 'uuid' });
    redisClient.lrange.mockResolvedValueOnce([]);
    await addFriend(socket, 'friend', cb);
    expect(cb).toHaveBeenCalledWith({
      done: true,
      newFriend: { username: 'friend', userid: 'uuid' },
    });
  });
});
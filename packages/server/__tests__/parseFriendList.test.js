const redisClient = require('../redis');
const parseFriendList = require('../controllers/socketio/parseFriendList');

jest.mock('../redis', () => ({
  hget: jest.fn(),
}));

describe('parseFriendList', () => {
  test('should return parsed friend list if friend list is valid', async () => {
    redisClient.hget.mockResolvedValueOnce(true);
    const result = await parseFriendList(['friend.uuid']);
    expect(result).toEqual([
      { username: 'friend', userid: 'uuid', connected: true },
    ]);
  });
});
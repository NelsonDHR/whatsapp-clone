const { authorizeUser } = require('../../controllers/socketController');

describe('authorizeUser', () => {
  let mockSocket;
  let mockNext;

  beforeEach(() => {
    mockSocket = {
      request: {
        session: {}
      }
    };
    mockNext = jest.fn();
  });

  test('should call next with an error if there is no session', () => {
    delete mockSocket.request.session;
    authorizeUser(mockSocket, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error('Not authorized'));
  });

  test('should call next with an error if there is no user in the session', () => {
    authorizeUser(mockSocket, mockNext);
    expect(mockNext).toHaveBeenCalledWith(new Error('Not authorized'));
  });

  test('should call next without arguments if there is a user in the session', () => {
    mockSocket.request.session.user = {};
    authorizeUser(mockSocket, mockNext);
    expect(mockNext).toHaveBeenCalledWith();
  });
});
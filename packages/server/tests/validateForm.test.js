
const validateForm = require('../controllers/express/validateForm');

const Yup = require("yup");

describe("validateForm", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn(() => res),
      send: jest.fn()
    };
    next = jest.fn();
  });

  it("should call next if form data is valid", async () => {
    req = { body:{
        username: "john_doe",
        password: "pass123"
    }
    };

    await validateForm(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
  });

  it("should send status 422 if form data is invalid", async () => {
    req.body = {
      username: "john",
      password: ""
    };

    await validateForm(req, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});

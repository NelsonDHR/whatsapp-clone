const { formSchema } = require("@whatsapp-clone/common");
const validateForm = require("../../controllers/validateForm");

describe("validateForm middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {
        username: "validUsername",
        password: "validPassword",
      },
    };
    res = {
      status: jest.fn(() => res),
      send: jest.fn(() => res),
    };
    next = jest.fn();
  });

  /*test("should call next if form is valid", () => {
    formSchema.validate = jest.fn(() => Promise.resolve());

    return validateForm(req, res, next).then(() => {
      expect(formSchema.validate).toHaveBeenCalledWith(req.body);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(res.send).not.toHaveBeenCalled();
    });
  });*/

  it("should send a 422 status if form is invalid", async () => {
    const error = new Error();
    error.name = "ValidationError";
    formSchema.validate = jest.fn(() => Promise.reject(error));

    await validateForm(req, res, next);

    expect(formSchema.validate).toHaveBeenCalledWith(req.body);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.send).toHaveBeenCalled();
  });
});

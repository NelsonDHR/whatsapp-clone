const { jwtSign, jwtVerify, getJwt } = require("../controllers/jwt/jwtAuth");

// Tests that a valid payload, secret, and options are provided, and token is successfully generated.
it("test_happy_path_valid_payload_secret_options", async () => {
  const payload = { id: 1, name: "Test" };
  const secret = "mysecret";
  const options = { expiresIn: "1h" };
  const token = await jwtSign(payload, secret, options);
  expect(token).toBeDefined();
});

// Tests that the function rejects with an error when an invalid payload is provided.
it("test_edge_case_invalid_payload", async () => {
  const payload = null;
  const secret = "mysecret";
  const options = { expiresIn: "1h" };
  await expect(jwtSign(payload, secret, options)).rejects.toThrow();
});

// Tests that jwtVerify resolves with decoded token payload when token and secret are valid and match
it("test_valid_token_and_secret", async () => {
  const payload = { id: 1, name: "Test" };
  const secret = "mysecret";
  const options = { expiresIn: "1h" };
  const token = await jwtSign(payload, secret, options);
  const decoded = await jwtVerify(token, "mysecret");
  expect(decoded.name).toBe("Test");
});

// Tests that jwtVerify rejects with error when secret is incorrect
it("test_valid_token_and_incorrect_secret", async () => {
  const token = jwtSign({ user: "test" }, "secret");
  await expect(jwtVerify(token, "incorrect_secret")).rejects.toThrow();
});

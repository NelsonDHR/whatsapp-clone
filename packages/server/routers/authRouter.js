const express = require("express");
const validateForm = require("../controllers/express/validateForm");
const router = express.Router();
const {
	handleLogin,
	attemptLogin,
	attemptRegister,
} = require("../controllers/authController");
const rateLimiter = require("../controllers/express/rateLimiter");

router
	.route("/log-in")
	.get(handleLogin)
	.post(validateForm, rateLimiter(60, 10), attemptLogin);
router.post("/sign-up", validateForm, rateLimiter(30, 4), attemptRegister);

module.exports = router;
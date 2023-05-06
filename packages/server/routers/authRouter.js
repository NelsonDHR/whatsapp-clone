const express = require("express");
const router = express.Router();
const validateForm = require("../controllers/validateForm");
const {
	handleLogin,
	attempLogin,
	attempRegister,
} = require("../controllers/authController");
const { rateLimiter } = require("../controllers/rateLimiter");

router
	.route("/log-in")
	.get(handleLogin)
	.post(validateForm, rateLimiter(60, 10), attempLogin);

router.post("/sign-up", validateForm, rateLimiter(30, 4), attempRegister);

module.exports = router;

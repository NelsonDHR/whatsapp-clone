const Yup = require("yup");

const formSchema = Yup.object({
	username: Yup.string()
		.required("Username required")
		.min(6, "Username too short")
		.max(20, "Username too long"),
	password: Yup.string()
		.required("Password required")
		.min(6, "Password too short")
		.max(20, "Password too long"),
});

const friendSchema = Yup.object({
	friendName: Yup.string()
		.required("Username required")
		.min(6, "Invalid Username")
		.max(20, "Invalid Username"),
});

module.exports = { formSchema, friendSchema };

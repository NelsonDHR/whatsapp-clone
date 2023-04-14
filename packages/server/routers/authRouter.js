const express = require('express');
const router = express.Router();
const Yup = require("yup");
const validateForm = require("../controllers/validateForm")


router.post("/log-in",(req,res)=>{
    validateForm(req,res);
});

router.post("/sign-up",(req,res)=>{
    validateForm(req,res)
});

module.exports = router;
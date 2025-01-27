// Importing express module
const express = require("express");

// Creating a router object
const router = express.Router();

// Importing the auth middleware
const { auth } = require("../middleware/auth");

// Importing the company controller
const {
  registerCompany,
  sendEmailOtp,
  sendPhoneOtp,
  loginCompany,
  postJob,
} = require("../controllers/companyController");

// Defining the routes

// Route to register a company
router.post("/register", registerCompany);

// Route to send OTP to email
router.post("/send-email-otp", sendEmailOtp);

// Route to send OTP to phone
router.post("/send-phone-otp", sendPhoneOtp);

// Route to login a company
router.post("/login", loginCompany);

// Route to post a job
router.post("/post-job",auth, postJob);

// Exporting the router object to be used in other parts of the application
module.exports = router;

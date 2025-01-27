const Company = require("../models/Company");
const Job = require("../models/Job");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const smsSender = require("../utils/smsSender");

let emailOtpStore = {};
let phoneOtpStore = {};

// Send OTP to email
exports.sendEmailOtp = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  const emailOtp = Math.floor(1000 + Math.random() * 9000).toString();

  emailOtpStore[email] = emailOtp;

  const emailSubject = "Email Verification OTP";
  const emailBody = `<p>Your OTP for email verification is: <strong>${emailOtp}</strong></p>`;

  try {
    await mailSender(email, emailSubject, emailBody);
    res.status(200).json({
      success: true,
      message: "OTP sent to email",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending OTP to email",
      error,
    });
  }
};

// Send OTP to phone
exports.sendPhoneOtp = async (req, res) => {
  const { phoneNo } = req.body;

  if (!phoneNo) {
    return res.status(400).json({ error: "Phone number is required" });
  }

  const phoneOtp = Math.floor(1000 + Math.random() * 9000).toString();

  phoneOtpStore[phoneNo] = phoneOtp;

  try {
    await smsSender(phoneNo, phoneOtp);
    res.status(200).json({
      success: true,
      message: "OTP sent to phone",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending OTP to phone",
      error,
    });
  }
};

// Register company
exports.registerCompany = async (req, res) => {
  try {
    const { name, email, password, phoneNo, emailOtp, phoneOtp } = req.body;

    if (!name || !email || !password || !phoneNo || !emailOtp || !phoneOtp) {
      return res
        .status(400)
        .json({ error: "All fields are required to register a company" });
    }

    // Check if name is already in use
    const nameExists = await Company.findOne({ name });
    if (nameExists) {
      return res.status(400).json({ error: "Company name already exists" });
    }

    // Check if the email is already in use
    const emailExists = await Company.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Check if OTPs are provided and valid
    if (emailOtpStore[email] !== emailOtp) {
      return res.status(400).json({ message: "Invalid or expired email OTP" });
    }

    if (phoneOtpStore[phoneNo] !== phoneOtp) {
      return res.status(400).json({ message: "Invalid or expired phone OTP" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new company
    const company = new Company({
      name,
      email,
      password: hashedPassword,
      phoneNo,
    });

    // Save the company
    await company.save();

    // Clear OTP stores
    delete emailOtpStore[email];
    delete phoneOtpStore[phoneNo];

    res.status(201).json({
      success: true,
      company,
      message: "Company registered successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error registering company",
      error,
    });
  }
};

// Login company
exports.loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Check if the email exists
    const company = await Company.findOne({ email });
    if (!company) {
      return res.status(400).json({ error: "Invalid email" });
    }

    // Check if the password is correct
    const validPassword = await bcrypt.compare(password, company.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid password" });
    }

    // create a jwt token and send it to the client side
    const token = jwt.sign({ _id: company._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // send company with password removed
    company.password = undefined;

    res.status(200).json({
      success: true,
      message: "Company logged in successfully",
      company,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in company", error });
  }
};

// Post a job
exports.postJob = async (req, res) => {
  try {
    const { title, description, experienceLevel, candidateEmails, endDate } =
      req.body;
    const companyId = req.user._id;
    console.log("Company ID:", companyId);

    // Validate required fields
    if (
      !title ||
      !description ||
      !experienceLevel ||
      !candidateEmails ||
      !endDate
    ) {
      return res
        .status(400)
        .json({ error: "All fields are required to post a job" });
    }

    // Find the company details
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }

    // Create a new job
    const job = new Job({
      title,
      description,
      experienceLevel,
      company: companyId,
      endDate,
    });

    // Save the job
    await job.save();

    // Send email to all candidates with the job details
    const emailSubject = `New Job: ${title}`;
    const emailBody = `
      <h1>${title}</h1>
      <p>${description}</p>
      <p><strong>Experience Level:</strong> ${experienceLevel}</p>
      <p><strong>Apply before:</strong> ${endDate}</p>
      <p><strong>Company:</strong> ${company.name}</p>
      <p><strong>Company Email:</strong> ${company.email}</p>
      <p><strong>Company Phone:</strong> ${company.phoneNo}</p>
    `;

    // There are multiple candidate emails so send email to each one
    const allEmails = Array.isArray(candidateEmails)
      ? candidateEmails
      : [candidateEmails];

    for (const candidateEmail of allEmails) {
      await mailSender(candidateEmail, emailSubject, emailBody);
    }

    res.status(201).json({
      success: true,
      job,
      message: "Job posted and emails sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error posting job",
      error,
    });
  }
};

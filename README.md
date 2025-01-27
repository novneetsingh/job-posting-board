# Job Posting Board with Email Automation

This project is a full-stack application that allows companies to register, verify their accounts via email/phone, post job listings, and send job alerts to candidates. It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### Backend APIs

1. **Company Registration**

   - Endpoint: `/companies/register`
   - Request: `POST`
   - Parameters: `name`, `email`, `password`, `phoneNo`, `emailOtp`, `phoneOtp`
   - Registers a company after verifying the email and phone OTPs.

2. **Login**

   - Endpoint: `/companies/login`
   - Request: `POST`
   - Parameters: `email`, `password`
   - Generates a JWT token for authentication.

3. **Send Email OTP**

   - Endpoint: `/companies/send-email-otp`
   - Request: `POST`
   - Parameters: `email`
   - Sends an OTP to the provided email for verification (powered by Nodemailer).

4. **Send Phone OTP**

   - Endpoint: `/companies/send-phone-otp`
   - Request: `POST`
   - Parameters: `phoneNo`
   - Sends an OTP to the provided phone number (powered by Twilio).

5. **Post a Job**
   - Endpoint: `/companies/post-job`
   - Request: `POST`
   - Parameters: `title`, `description`, `experienceLevel`, `candidateEmails`, `endDate`
   - Posts a job for verified companies and sends job details to candidate emails.

### Frontend Pages

1. **Signup Page**

   - URL: `/`
   - Features a form for companies to register with validation for all fields.

2. **Login Page**

   - URL: `/login`
   - Features a form for companies to log in and obtain JWT tokens.

3. **Post Job Page**
   - URL: `/post-job`
   - Allows authenticated companies to post jobs with details like title, description, experience level, and a list of candidate emails.

## Tech Stack

- **Frontend:** React.js (Vite setup)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT
- **Email Service:** Nodemailer
- **Phone OTP Service:** Twilio

const twilio = require("twilio");

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

const smsSender = async (phoneNumber, code) => {
  try {
    const message = await client.messages.create({
      body: `Your verification code is ${code}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    return message;
  } catch (error) {
    console.log(error.message);
    return error.message;
  }
};

module.exports = smsSender;

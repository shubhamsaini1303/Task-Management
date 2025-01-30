const { Resend } = require("resend");

// Check if the API key is provided in environment variables
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error("RESEND_API_KEY is not defined in environment variables");
}

// Initialize Resend client with the API key
const resend = new Resend(apiKey);

module.exports = resend;



// ../helper/sendVerificationEmail.js
const resend = require("../utils/resend"); // Correct import of the resend client
const VerificationEmail = require("../email/verificationEmail");

async function sendVerificationEmail(email, name, verifyCode) {
  try {
    // Sending email via Resend client
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>", // Sender address
      to: email,  // Recipient email
      subject: "Verification Code",
      react: VerificationEmail({ name, otp: verifyCode }), // Assuming VerificationEmail is a function that returns the email content
    });

    return {
      success: true,
      message: "Verification email sent successfully",
    };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}

module.exports = { sendVerificationEmail };

const User = require("../model/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const bcrypt = require("bcrypt");

// generate random otp......
async function generateOTP() {
  const OTP = await crypto.randomInt(100000, 900000).toString();
  return OTP;
}

// create a nodmailer transporter
const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// verify email and send otp.....
async function verfiyUserEmail(req, res) {
  const { email } = req.body;
  const otp = await generateOTP();
  const expireAt = new Date(Date.now() + 2 * 60 * 1000);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log("hello");
      res.locals.verifyOtp = false;
      res.locals.resetPass = false;
      res.locals.sms = "Invalid Email ID";
      return res.render("forgetPassword");
    }
    user.otp = otp;
    user.expireAt = expireAt;
    await user.save();

    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: user.email,
      sub: `Your OTP for password reset`,
      text: `Your OTP is ${otp}. It is valid for only two minutes`,
      html: "<p><b>Hello</b> to myself!</p>",
    });
    res.locals.userEmail = user.email;
    res.locals.verifyOtp = true;
    res.locals.resetPassword = false;
    res.locals.sms = "OTP was sent to your email account";
    return res.render("forgetPassword");
  } catch (err) {
    console.log(err);
  }
}

async function verifyUserOtp(req, res) {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email: email });
    console.log(user);
    console.log(typeof user.otp);

    const verifiedOtp = await bcrypt.compare(otp, user.otp);
    console.log(verifiedOtp);

    if (!verifiedOtp) {
      res.locals.userEmail = user.email;
      res.locals.verifyOtp = true;
      res.locals.resetPassword = false;
      res.locals.sms = "Invalid OTP. Please enter the correct OTP.";
      return res.render("forgetPassword");
    }

    res.locals.userEmail = user.email;
    res.locals.verifyOtp = false;
    res.locals.resetPassword = true;
    res.locals.sms = "Enter new password to reset";
    return res.render("forgetPassword");
  } catch (err) {
    console.log(`Error during OTP verification: ${err}`);
  }
}

async function resetUserPassword(req, res) {
  const { email, newPassword } = req.body;
  console.log(email);
  console.log(newPassword);

  try {
    const user = await User.findOne({ email });
    user.password = newPassword;
    await user.save();
    res.locals.sms = `${user.email} Your password was reset... pls login`;
    return res.render("signin");
  } catch (err) {
    console.log(`Error During Reseting Password ${err}`);
  }
}

module.exports = { verfiyUserEmail, verifyUserOtp, resetUserPassword };

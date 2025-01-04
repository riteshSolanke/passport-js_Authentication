const express = require("express");
const router = express.Router();
const User = require("../model/userModel");
const passport = require("../config/passportConfig");
const {
  verfiyUserEmail,
  verifyUserOtp,
  resetUserPassword,
} = require("../config/forgetPasswordConfig");

// ----------------------------Local Strategy for passport ------------------------------

// verify user login and signup credential
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res
        .status(500)
        .render("signin", { sms: "Unexpected error occurred" });
    }
    if (!user) {
      return res.status(401).render("signin", { sms: info.sms });
    }
    req.login(user, (err) => {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .render("signin", { sms: "Failed to login user" });
      }
      console.log("User logged in successfully:", user);
      // Redirect only after successful login
      return res.redirect("/authuser/authIndex");
    });
  })(req, res, next);
});

// logout functionallity

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error(err);
      return res.status(500).render("/", { sms: "Error during logout" });
    }

    // Ensure only one response is sent
    req.session.regenerate((err) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .render("home", { sms: "Error regenerating session" });
      }
      res.clearCookie("connect.sid"); // Clear session cookie
      return res.redirect("/");
    });
  });
});

// signup functionallity
router.post("/signup", async function (req, res) {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email: email });
  if (existingUser) {
    res.locals.sms = "This User already exists";
    return res.render("signin");
  }

  try {
    await User.create({
      name,
      email,
      password,
    });

    return res.render("signin", {
      sms: "your account was created, please login !",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Error during signup");
  }
});

// -----------------------github-Auth functionallity for passport-----------------------------

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    return res.redirect("/authuser/authIndex");
  }
);

// -----------------------Google-Auth functionallity for passport-----------------------------

router.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/signin" }),
  (req, res) => {
    return res.redirect("/authuser/authIndex");
  }
);

// ------------------------Forget-password functionllity -----------------------------------

router.post("/forgetPassword", verfiyUserEmail);
router.post("/verifyOtp", verifyUserOtp);
router.post("/resetPassword", resetUserPassword);

module.exports = router;

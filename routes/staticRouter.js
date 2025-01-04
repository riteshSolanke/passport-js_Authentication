const express = require("express");
const router = express.Router();
const {
  renderHomePage,
  renderSigninPage,
  renderSignupPage,
  renderForgetPasswordPage,
} = require("../controller/staticController");

router.get("/", renderHomePage);
router.get("/signin", renderSigninPage);
router.get("/signup", renderSignupPage);
router.get("/forgotPassword", renderForgetPasswordPage);

module.exports = router;

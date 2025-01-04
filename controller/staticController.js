const { render } = require("ejs");

async function renderHomePage(req, res) {
  return res.render("home");
}

async function renderSigninPage(req, res) {
  return res.render("signin");
}

async function renderSignupPage(req, res) {
  return res.render("signup");
}

async function renderForgetPasswordPage(req, res) {
  return res.render("forgetPassword");
}

module.exports = {
  renderHomePage,
  renderSigninPage,
  renderSignupPage,
  renderForgetPasswordPage,
};

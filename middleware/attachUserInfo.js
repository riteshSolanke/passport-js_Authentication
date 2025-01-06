async function attachUserInfo(req, res, next) {
  if (req.isAuthenticated() && req.user) {
    res.locals.user = req.user;
  } else {
    res.locals.user = null;
    res.locals.sms = "There is problem in deserilization of user";
    return res.render("home");
  }
  next();
}

module.exports = { attachUserInfo };

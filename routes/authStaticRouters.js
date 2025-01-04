const express = require("express");
const router = express.Router();

const { renderAuthIndexPage } = require("../controller/authPageController");

router.get("/authIndex", renderAuthIndexPage);

module.exports = router;

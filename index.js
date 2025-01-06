require("dotenv").config();
const express = require("express");
const app = express();
const MongoStore = require("connect-mongo");
const PORT = process.env.PORT || 9000;

// express-session config
const passport = require("passport");
const expressSession = require("express-session");
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET || "default_fallback_secret",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      ttl: 14 * 24 * 60 * 60, // Session expiration in seconds (14 days)
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 14,
      secure: false,
      httpOnly: true,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Mongoose connection...
const connectMongoAtlas = require("./config/mongoConnection");
connectMongoAtlas();

// middlewares
const { attachUserInfo } = require("./middleware/attachUserInfo");

const staticRouter = require("./routes/staticRouter");
const userRouter = require("./routes/userRouter");
const authRouter = require("./routes/authStaticRouters");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", staticRouter);
app.use("/user", userRouter);
app.use("/authuser", attachUserInfo, authRouter);

app.listen(PORT, () => {
  console.log(`server running on port number ${PORT}`);
});

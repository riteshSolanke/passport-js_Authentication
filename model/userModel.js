const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
    },
    githubId: {
      type: String,
    },
    profilePicture: {
      type: String,
      default: "/images/profile_img.png",
    },
    otp: {
      type: String,
      default: null,
    },
    expireAt: {
      Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// pre- save mongoose hook
userSchema.pre("save", async function (next) {
  try {
    // Hash password if modified
    if (this.isModified("password") && this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    // Hash OTP if modified
    if (this.isModified("otp") && this.otp) {
      const salt = await bcrypt.genSalt(10);
      this.otp = await bcrypt.hash(this.otp, salt);
    }

    next();
  } catch (error) {
    next(error);
  }
});

// post- save mongoose hook
userSchema.post("save", async function (doc, next) {
  console.log(`New user created : ${doc.name}`);
});

// model for userSchema

const User = mongoose.model("userCollection", userSchema);

module.exports = User;

require("dotenv").config();
const mongoose = require("mongoose");

const connectMongoAtlas = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Your are connected to mongodb successfully`);
  } catch (err) {
    console.log(`Error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectMongoAtlas;

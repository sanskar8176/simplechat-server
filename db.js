const mongoose = require("mongoose");
const colors = require("colors");

const dbConnect = async () => {
  try {
    const connectionString = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017", {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log(
      colors.brightMagenta(
        `\nDB connected: ${connectionString.connection.host}\n`
      )
    );
  } catch (error) {
    console.log(colors.brightRed("\nConnection to link DB failed\n"));
  }
};

module.exports = dbConnect;

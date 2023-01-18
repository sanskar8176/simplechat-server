const mongoose = require("mongoose");
const colors = require("colors");

const dbConnect = async (user, password) => {
  try {
    const connectionString = await mongoose.connect(`mongodb+srv://${user}:${password}@cluster0.icetgwg.mongodb.net/?retryWrites=true&w=majority` || "mongodb://localhost:27017", {
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

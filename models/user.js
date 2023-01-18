const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is a required field"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default:
        "https://res.cloudinary.com/dh9rf3psk/image/upload/v1673967493/photos/default-avatar_lav4in.png",
    },
  },
  {
    timestamps: true,
  }
);
userSchema.methods.matchPassword = async function (givenPass) {
  return await bcrypt.compare(givenPass, this.password);
};
userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified) {
    next();
  }
  //   ? hash the password
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
});

const User = mongoose.model("User", userSchema);
module.exports = User;

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");

const { SECRET_KEY } = require("../../config");
const User = require("../../models/User");
const {
  validateRegisterInput,
  validateLoginInput,
} = require("../../util/validators");

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
}

module.exports = {
  Mutation: {
    async register(
      parent,
      { registerInput: { username, email, password, confirmPassword } },
      context,
      info
    ) {
      //validate user data
      const { valid, errors } = validateRegisterInput(
        username,
        email,
        password,
        confirmPassword
      );
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      // make sure user dose not already exist
      const user = await User.findOne({ username });
      if (user) {
        throw new UserInputError(" Username is taken", {
          errors: {
            username: "This username is taken",
          },
        });
      }
      //Hash password and create an auth token
      password = await bcrypt.hash(password, 12);

      const newUser = User({
        email,
        username,
        password,
        createdAt: new Date().toISOString(),
      });

      const res = await newUser.save();

      const token = generateToken(res);

      return {
        ...res._doc,
        id: res._id,
        token,
      };
    },

    async login(parent, { username, password }, context, info) {
      //validate user data
      const { valid, errors } = validateLoginInput(username, password);
      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      //get data from DB
      const user = await User.findOne({ username });
      if (!user) {
        errors.general = "User not found";
        throw new UserInputError("User not found", {
          errors: {
            username: "User not found",
          },
        });
      }

      //check of password matches
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        errors.general = "Wrong credentials";
        throw new UserInputError("Wrong credentials", {
          errors: {
            password: "Worng credentials",
          },
        });
      }

      //if password matches, generate login token
      const token = generateToken(user);

      //return data with token
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    },
  },
};

const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const payload = req.body;
    // {
    //     name: 'John',
    //     email: 'john@gmail.com',
    //     password: 'Welcome123',
    //     mobileNumber: '11111111',
    //     role: 1
    // }

    if (!payload.password) {
      return res.status(400).send({ message: "Password is required!" });
    }

    const hashedValue = await bcrypt.hash(payload.password, 10);

    payload.hashedPassword = hashedValue;
    // {
    //     name: 'John',
    //     email: 'john@gmail.com',
    //     password: 'Welcome123',
    //     hashedPassword: 'afswginergpfscomsdvlkn'
    //     mobileNumber: '11111111',
    //     role: 1
    // }

    delete payload.password;
    // {
    //     name: 'John',
    //     email: 'john@gmail.com',
    //     hashedPassword: 'afswginergpfscomsdvlkn'
    //     mobileNumber: '11111111',
    //     role: 1
    // }

    const newUser = new Users(payload);

    newUser
      .save()
      .then((data) => {
        res.status(201).send({
          message: "User has been registered successfully",
          userId: data._id,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          message: "Error while registering a new user.",
          error: error,
        });
      });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      // IsValidUser or not
      //   existingUser.hashedPassword
      const isValidUser = await bcrypt.compare(
        password,
        existingUser.hashedPassword
      ); // true or false

      if (isValidUser) {
        const token = await jwt.sign(
          { _id: existingUser._id },
          process.env.SECRET_KEY
        );

        res.cookie("accessToken", token, { expire: new Date() });

        return res.status(200).send({
          message: "User logged-in successfully",
        });
      }

      return res.status(400).send({
        message: "Invalid credentials",
      });
    }

    res.status(400).send({
      message: "User doesnt exist with the given email",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.logout = async (req, res) => {
  try {
    await res.clearCookie("accessToken");

    return res.status(200).send({
      message: "User logged-out successfully.",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

// REGISTER

// {
//   name, email, password, mobileNumber;
// }

// {
//   name, email, hashedPassword, mobileNumber;
// }

// If password given, Convert the password -> hashedPassword, else error to provide the password
// Validate all the data is matching the schema
// Save

// HASHING -> the mechanism to convert  data into random form
// bcrypt - package used for hashing

// LOGIN

// {
//   email, password;
// }

// User EXISTS with the email
// Compare the password with the hashedPassword in our db

// Create a session for that user ->
// create a token -> that will be stored in cookies -> with expiration

// COOKIES, LOCAL STORAGE, SESSION STORAGE

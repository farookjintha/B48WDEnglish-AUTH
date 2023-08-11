const Users = require("../models/users.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Tokens = require("../models/tokens.model");
const crypto = require("crypto");
const { sendEmail } = require("../utils/sendEmail");
const mongoose = require("mongoose");

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

    //Hashing
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
        //Encryption
        const token = await jwt.sign(
          { _id: existingUser._id },
          process.env.SECRET_KEY
        );
        // { _id: existingUser._id } -> sdfsfgbdeblndv ENCRYPTION

        // res.cookie("accessToken", token, { expire: new Date() + 86400000 });
        res.cookie("accessToken", token, {
          expires: new Date(Date.now() + 86400000),
        });

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
    console.log(error);
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

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const user = await Users.findOne({ email: email });

    if (!user) {
      return res
        .status(400)
        .send({ message: "User with the given email doesnt exist" });
    }

    let token = await Tokens.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
      // await Tokens.deleteOne({ userId: user._id });
    }

    //CREATION OF NEW TOKEN
    const newToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = await bcrypt.hash(newToken, 10);

    const tokenPayload = new Tokens({ userId: user._id, token: hashedToken });

    await tokenPayload.save();

    const link = `http://localhost:3000/reset-password/?token=${newToken}&userId=${user._id}`;

    const isMailSent = await sendEmail(user.email, "RESET PASSWORD", {
      resetPasswordLink: link,
    });

    if (isMailSent) {
      return res
        .status(200)
        .send({ message: "Reset password link has been sent to your email." });
    }

    return res.status(500).send({ message: "Error while sending email" });

    // Verification
    // if there is token already in the Token collection with userId and delete it

    // create a new token and save it
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { userId, token, newPassword } = req.body;

    const resetToken = await Tokens.findOne({ userId: userId });

    if (!resetToken) {
      return res.status(401).send({ message: "Token doesnt exist" });
    }

    const isValidToken = await bcrypt.compare(token, resetToken.token);

    if (!isValidToken) {
      return res.status(400).send({ message: "Invalid Token" });
    }

    // Hash the new password

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    Users.findByIdAndUpdate(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: { hashedPassword: hashedPassword } }
    )
      .then((data) => {
        res.status(200).send({
          message: "Password has been reset successfully.",
          userId: data._id,
        });
      })
      .catch((error) => {
        return res.status(400).send({
          message: "Error while resetting user's password.",
          error: error,
        });
      });
    //
    //
  } catch (error) {
    console.log("Error while resetting: ", error);
    return res.status(500).send({
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

// Hashing -> Welcome123 -> afsjknvdnddvdv -> UNIDIRECTIONAL -> only compare
// Encryption / Decryption -> jwt -> {key: value} -> sfdjbdnbdkn -> BI DIRECTIONAL

//
//
//
//

// FORGOT PASSWORD

// POST -> email
// findUser with email

// new unique token will be generated for this user

// _id:
// token: hashing(token)

// http://localhost:3000/resetPassword?token={token} -> email

// compare -> token -> hashedToken

// send a link to the email to reset the password

import { Router } from "express";
import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../config/generateToken.js";
import verifyToken from "../config/verifyToken.js";

const router = Router();

// Sign Up for new user
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await User.findOne({ email });

    // email validation
    if (doesUserExists)
      return res
        .status(400)
        .json("An user with this email already exists try signing in!");

    const hashedPassword = await generateHashedPassword(password);
    const user = new User({
      ...req.body,
      userType: "user",
      password: hashedPassword,
    });

    const createdUser = await user.save();
    const token = generateToken(createdUser);
    res.status(201).header("auth-token", token).json({
      _id: createdUser._id,
      email: createdUser.email,
      userType: createdUser.userType,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// login to use the app
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const doesUserExists = await User.findOne({ email });

    if (!doesUserExists)
      return res
        .status(400)
        .json("No user exists with this email!, Try creating an account.");

    const isPasswordValid = await bcrypt.compare(
      password,
      doesUserExists.password
    );

    if (!isPasswordValid) return res.status(400).json("Invalid Password!");

    const token = generateToken(doesUserExists);
    res.status(200).header("auth-token", token).json({
      _id: doesUserExists._id,
      email: doesUserExists.email,
      userType: doesUserExists.userType,
      token,
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

router.get("/user/autoLogin", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      userType: user.userType,
      token: req.header("auth-token"),
    });
  } catch (error) {
    res.status(500).json(`Something went wrong and an error occured: ${error}`);
  }
});

// function for generating hashed password
const generateHashedPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Hashing error: ${error}`);
  }
};

export default router;

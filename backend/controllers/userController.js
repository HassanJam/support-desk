const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  console.log("registerUser - Request body:", req.body);

  if (!name || !email || !password) {
    console.log("registerUser - Missing fields");
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  console.log("registerUser - Checking for existing user with email:", email);
  let userExists;
  try {
    userExists = await User.findOne({ where: { email } });
    console.log(
      "registerUser - User exists check result:",
      userExists ? userExists.toJSON() : "No existing user"
    );
  } catch (error) {
    console.error(
      "registerUser - Error in findOne:",
      error.message,
      error.stack
    );
    res.status(500);
    throw new Error("Database error while checking user existence");
  }

  if (userExists) {
    console.log("registerUser - User already exists:", userExists.toJSON());
    res.status(400);
    throw new Error("User already exists");
  }

  console.log("registerUser - Attempting to create user");
  try {
    const user = await User.create({ name, email, password });
    console.log(
      "registerUser - User creation result:",
      user ? user.toJSON() : "null"
    );
    if (user) {
      console.log("registerUser - User created successfully:", user.toJSON());
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
        token: generateToken(user.id),
      });
    } else {
      console.log("registerUser - User creation returned null");
      res.status(400);
      throw new Error("User could not be created");
    }
  } catch (error) {
    console.error(
      "registerUser - Error creating user:",
      error.message,
      error.stack
    );
    res.status(400);
    throw new Error(`User creation failed: ${error.message}`);
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.status(200).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      is_admin: user.is_admin,
      token: generateToken(user.id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid credentials");
  }
});

const getMe = asyncHandler(async (req, res) => {
  const user = {
    id: req.user.id, // Adjusted to match Sequelize
    email: req.user.email,
    name: req.user.name,
    is_admin: req.user.is_admin,
  };
  res.status(200).json(user);
});

// Assuming generateToken is defined elsewhere in the file
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
};

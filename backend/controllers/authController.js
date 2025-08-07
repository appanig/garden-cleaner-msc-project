const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const ServiceProvider = require("../models/ServiceProvider");

const tokenGenerator = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

exports.registerUser = async (req, res) => {
  const { name, email, password, role, agreeToTerms } = req.body;

  if (
    !name ||
    !email ||
    !password ||
    !role ||
    agreeToTerms === null ||
    String(agreeToTerms).length === 0
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["homeowner", "provider"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      agreeToTerms,
    });

    // If the user is a provider, create a ServiceProvider profile
    if (role === "provider") {
      await ServiceProvider.create({
        user: newUser._id,
        bio: "",
        services: [],
        isEcoFriendly: false,
        availableSlots: [],
        rating: 0,
      });
    }

    const token = tokenGenerator(newUser._id);

    res.status(201).json({
      token,
      user: { id: newUser._id, name, email, role },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = tokenGenerator(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

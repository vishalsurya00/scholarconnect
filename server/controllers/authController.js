const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Helper to generate JWT Token
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET || 'scholarconnect_super_secret_jwt_key_2026_india_edtech',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// Helper to check if string looks like an email address
const isEmail = (input) => {
  return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(input.trim());
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new student user (Email OR Phone)
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { fullName, identifier, email, phone, password, confirmPassword } = req.body;

    // Determine target input (accepting identifier or explicit email/phone)
    const targetIdentifier = (identifier || email || phone || '').trim();

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full Name is required.',
      });
    }

    if (!targetIdentifier) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either an Email address or Phone number.',
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match.',
      });
    }

    let userEmail = null;
    let userPhone = null;

    if (isEmail(targetIdentifier)) {
      userEmail = targetIdentifier.toLowerCase();
    } else {
      userPhone = targetIdentifier;
    }

    // Check if user already exists
    const query = [];
    if (userEmail) query.push({ email: userEmail });
    if (userPhone) query.push({ phone: userPhone });

    const existingUser = await User.findOne({ $or: query });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: userEmail
          ? 'An account with this email already exists.'
          : 'An account with this phone number already exists.',
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create User document
    const newUser = await User.create({
      fullName: fullName.trim(),
      email: userEmail,
      phone: userPhone,
      passwordHash,
      role: 'student',
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    console.error('[Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & return JWT token (Email OR Phone)
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { identifier, email, phone, password } = req.body;
    const targetIdentifier = (identifier || email || phone || '').trim();

    if (!targetIdentifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your email/phone number and password.',
      });
    }

    let user;
    if (isEmail(targetIdentifier)) {
      user = await User.findOne({ email: targetIdentifier.toLowerCase() });
    } else {
      user = await User.findOne({
        $or: [{ phone: targetIdentifier }, { email: targetIdentifier.toLowerCase() }],
      });
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. No user found with provided Email/Phone.',
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: 'Login successful!',
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login. Please try again.',
      error: error.message,
    });
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Get currently authenticated user details
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[GetMe Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile.',
    });
  }
};

/**
 * @route   PUT /api/auth/update-name
 * @desc    Update authenticated user's Full Name
 * @access  Private (JWT Protected)
 */
const updateName = async (req, res) => {
  try {
    const { fullName } = req.body;

    if (!fullName || !fullName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Full Name cannot be empty.',
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    user.fullName = fullName.trim();
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Name updated successfully!',
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('[Update Name Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user name.',
      error: error.message,
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateName,
};

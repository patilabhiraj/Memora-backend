const authMiddleware = require('../middleware/authMiddleware');
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// ================= REGISTER =================
router.post('/register', async (req, res) => {
  console.log('Register API hit');

  const { name, email, password } = req.body;

  // check existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists with this email',
    });
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // create user
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
 console.log(" Created user Successfull : Name :",name,"email :",email,"email :",password);

  res.status(201).json({
    message: 'User Registered Successfully',
    user: {
      id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    },
  });
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    message: 'Protected route accessed',
    userId: req.userId,
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // 1️⃣ find user by email
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: 'User not found',
    });
  }

  // 2️⃣ compare password
  const isPasswordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordMatch) {
    return res.status(400).json({
      message: 'Invalid password',
    });
  }

  // 3️⃣ success
  const token = jwt.sign({userId:user._id},
    process.env.jwt_SECRET,
    {expiresIn: '7d'}
  );
  res.status(200).json({
    message: 'Login Successfull',
    token,
    user:{
      id:user._id,
      name:user.name,
      email:user.email,

    }
  });

});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({
    message: 'Protected route accessed',
    userId: req.userId,
  });
});


module.exports = router;

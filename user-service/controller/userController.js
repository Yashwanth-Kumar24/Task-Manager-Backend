const User = require('../models/User');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// Create a new user
    router.post('/', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if ( !name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
        }

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({ message: 'User already exists with this email' });
        }

        const newUser = new User({ name, email, password });
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
    });

// Get user by userId
router.get('/:userId',async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving user', error });
  }
});

// Get all users
router.get('/', async (req, res) => {
    try {
      const user = await User.find();
      if (user.length==0) {
        return res.status(404).json({ message: 'No Users' });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving user', error });
    }
  });

// Update user (full)
router.put('/:userId',async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email,password } = req.body;
    
    const updateData = { name, email };
    
    if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
    }
    
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Update user (partial)
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
    }
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error });
  }
});

// Delete user
router.delete('/:userId',async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.deleteMany({userId});
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: `User with id ${userId} deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error });
  }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the entered password with the stored hashed password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password' });
      }
  
      // If passwords match, return user details (or token)
      res.status(200).json({   message: 'Login successful', 
        userId: user.userId,  // Send userId
        name: user.name,  
        email: user.email  });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  });

module.exports = router;

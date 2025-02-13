const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Counter = require('./Counter'); // Counter model to handle userId incrementation

const userSchema = new mongoose.Schema({
  userId: {
    type: Number,
    unique: true, // Ensure userId is unique
    required: true,
  },
  name: {
    type: String,
    required: true,
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to auto-generate userId
userSchema.pre('validate', async function (next) {
  if (!this.isNew) return next(); // Only run for new documents

  try {
    // Increment and assign userId using the counter collection
    const counter = await Counter.findOneAndUpdate(
      { _id: 'userId' }, // Identifier for the userId sequence
      { $inc: { seq: 1 } }, // Increment the sequence
      { new: true, upsert: true } // Create the document if it doesn't exist
    );

    if (counter && counter.seq) {
      this.userId = counter.seq; // Assign the incremented userId
      next();
    } else {
      next(new Error('Failed to generate userId'));
    }
  } catch (error) {
    next(error); // Pass errors to the error-handling middleware
  }
});

// Middleware to hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(this.password, salt);
      this.password = hash;
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;

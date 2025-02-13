const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Create a new task
router.post('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { title, description, status } = req.body;
    
    const newTask = new Task({ userId, title, description, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
});

// Get all tasks (no filtering)
router.get('/', async (req, res) => {
    try {
      const tasks = await Task.find(); // Fetch all tasks in the database
      res.status(200).json(tasks); // Send the tasks as JSON response
    } catch (error) {
      res.status(500).json({ message: 'Error fetching all tasks', error });
    }
  });

// Get all tasks for a user
router.get('/:userId', async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.params.userId });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error });
  }
});

//update entire body
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL
    const { title, description, status } = req.body; // Extract fields to update from the request body

    // Validate input fields
    if (!title && !description && !status) {
      return res.status(400).json({ message: 'At least one field is required to update the task' });
    }

    // Find and update the task based on userId
    const updatedTask = await Task.findOneAndUpdate(
      { userId }, // Match the userId
      { title, description, status }, // Update the fields
      { new: true, runValidators: true } // Return the updated task and validate input
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found for the given userId' });
    }

    res.status(200).json(updatedTask); // Return the updated task
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

//update specific fields
router.patch('/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from URL
    const updateData = req.body;  // Extract fields to update from request body

    // Ensure there's at least one field to update
    if (!updateData || Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: 'No fields provided for update' });
    }

    // Update the task using userId
    const updatedTask = await Task.findOneAndUpdate(
      { userId },               // Match the task by userId
      { $set: updateData },     // Set only the fields provided in the body
      { new: true, runValidators: true } // Return updated document and validate
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found for the given userId' });
    }

    res.status(200).json(updatedTask); // Return the updated task
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Delete a task
router.delete('/:_id', async (req, res) => {
    try {
      const { _id } = req.params; // Extract userId from URL
  
      // Delete tasks based on userId
      const result = await Task.deleteMany({ _id });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'No tasks found for the given ID' });
      }
  
      res.status(200).json({
        message: `Successfully deleted ${result.deletedCount} task`,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting tasks', error });
    }
  });

module.exports = router;

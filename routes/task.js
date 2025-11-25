import express from 'express';
import { Task } from '../model/Task.js';
import moment from 'moment';
import mongoose from 'mongoose';

const router = express.Router();



// Add a task with a voice note
router.post('/add-task', async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate, priority, board } = req.body;
    
    console.log(req.body);

    const requiredFields = {
      title, description, assignedTo, dueDate, priority, board
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({ error: `${field.replace(/([A-Z])/g, ' $1')} is required` });
      }
    }

    // Extract boardId if board is an object
    let boardId;
    if (typeof board === 'object' && board.boardId) {
      boardId = board.boardId;
    } else if (typeof board === 'string') {
      boardId = board;
    } else {
      return res.status(400).json({ error: 'Invalid board format' });
    }

    // Validate that boardId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(boardId)) {
      return res.status(400).json({ error: 'Invalid board ID format' });
    }

    // Create a new task
    const newTask = new Task({
      title,
      description,
      status: 'To Do',
      priority,
      board: boardId, // Use the extracted boardId
      assignedTo,
      dueDate
    });

    await newTask.save();
    return res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.log('Error creating task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// In your backend route
// In your backend route
router.get('/get-tasks', async (req, res) => {
  try {
    const { status, board, priority,page = 1, limit = 10 } = req.query;
    
    const filter = {};


    
    
    // Filter by status if provided
    if (status) {
      filter.status = status;
    }

     if (priority) {
      filter.priority = priority;
    }
    
    // Filter by board if provided
    if (board) {
      filter.board = board;
    }

    const tasks = await Task.find(filter)
     .populate('board')
      .sort({ createdAt: -1 }) // Change from createdDate to createdAt
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const totalTasks = await Task.countDocuments(filter);

    return res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: parseInt(page),
      totalTasks
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Edit task status
router.patch('/:taskId/status', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Validate status
    const validStatuses = ['To Do', 'In Progress', 'Done'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Valid status is required' });
    }

    // Update task status
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ 
      message: 'Task status updated successfully', 
      task: updatedTask 
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete task
router.delete('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Delete task
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    return res.status(200).json({ 
      message: 'Task deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Edit task (full update)
router.put('/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { title, description, assignedTo, dueDate, priority, status, board } = req.body;

    // Validate task ID
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ error: 'Invalid task ID format' });
    }

    // Check if task exists
    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Prepare update data
    const updateData = {
      ...(title && { title }),
      ...(description && { description }),
      ...(assignedTo && { assignedTo }),
      ...(dueDate && { dueDate }),
      ...(priority && { priority }),
      ...(status && { status }),
      ...(board && { board })
    };

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updateData,
      { new: true, runValidators: true }
    ).populate('board');

    return res.status(200).json({ 
      message: 'Task updated successfully', 
      task: updatedTask 
    });

  } catch (error) {
    console.error('Error updating task:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});






export default router;
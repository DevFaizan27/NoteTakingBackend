// backend/src/controllers/noteController.js
import Note from '../model/Note.js';

// Create new note
export const createNote = async (req, res) => {
  try {
    const note = new Note({
      title: req.body.title || 'Untitled Note',
      content: req.body.content || ''
    });
    
    const savedNote = await note.save();
    res.status(201).json({
      success: true,
      data: savedNote
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: 'Error creating note',
      error: error.message
    });
  }
};

// Get note by ID
export const getNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching note',
      error: error.message
    });
  }
};

// Update note
export const updateNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndUpdate(
      req.params.id,
      {
        content: req.body.content,
        title: req.body.title,
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: note
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating note',
      error: error.message
    });
  }
};


// Get all notes with pagination and sorting
export const getAllNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'updatedAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    const notes = await Note.find()
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit)
      .select('title content updatedAt createdAt'); // Select only necessary fields

    const total = await Note.countDocuments();

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching notes',
      error: error.message
    });
  }
};

// Search notes by title or content
export const searchNotes = async (req, res) => {
  try {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const searchFilter = {
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } }
      ]
    };

    const notes = await Note.find(searchFilter)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('title content updatedAt createdAt');

    const total = await Note.countDocuments(searchFilter);

    res.status(200).json({
      success: true,
      data: notes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error searching notes',
      error: error.message
    });
  }
};

// Delete note
export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findByIdAndDelete(req.params.id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting note',
      error: error.message
    });
  }
};
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
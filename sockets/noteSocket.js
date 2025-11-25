// backend/src/sockets/noteSocket.js
export const setupNoteSocket = (io) => {
  const noteRooms = new Map(); // Track active users per note
  
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join a note room
    socket.on('join_note', (noteId) => {
      socket.join(noteId);
      
      // Track active users
      if (!noteRooms.has(noteId)) {
        noteRooms.set(noteId, new Set());
      }
      noteRooms.get(noteId).add(socket.id);
      
      // Notify others about new user
      socket.to(noteId).emit('user_joined', {
        userId: socket.id,
        activeUsers: Array.from(noteRooms.get(noteId))
      });
      
      // Send current active users to the new user
      socket.emit('active_users', {
        activeUsers: Array.from(noteRooms.get(noteId))
      });
      
      console.log(`User ${socket.id} joined note ${noteId}`);
    });

    // Handle note updates
    socket.on('note_update', async (data) => {
      const { noteId, content, title } = data;
      
      // Broadcast to other users in the room
      socket.to(noteId).emit('note_updated', {
        content,
        title,
        updatedBy: socket.id,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`Note ${noteId} updated by ${socket.id}`);
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
      
      // Remove user from all note rooms
      for (const [noteId, users] of noteRooms.entries()) {
        if (users.has(socket.id)) {
          users.delete(socket.id);
          
          // Notify others about user leaving
          socket.to(noteId).emit('user_left', {
            userId: socket.id,
            activeUsers: Array.from(users)
          });
          
          // Clean up empty rooms
          if (users.size === 0) {
            noteRooms.delete(noteId);
          }
        }
      }
    });

    // Leave note room
    socket.on('leave_note', (noteId) => {
      socket.leave(noteId);
      
      if (noteRooms.has(noteId)) {
        noteRooms.get(noteId).delete(socket.id);
        
        // Notify others about user leaving
        socket.to(noteId).emit('user_left', {
          userId: socket.id,
          activeUsers: Array.from(noteRooms.get(noteId))
        });
        
        // Clean up empty rooms
        if (noteRooms.get(noteId).size === 0) {
          noteRooms.delete(noteId);
        }
      }
    });
  });
};
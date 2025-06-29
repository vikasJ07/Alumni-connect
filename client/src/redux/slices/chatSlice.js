import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  unreadCount: null, // Will hold unread counts as { roomId: count }
  lastMessage: null, // Will hold last messages as { roomId: { text, senderId, timestamp } }
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    updateUnreadCount: (state, action) => {
      const { roomId, count } = action.payload;
      state.unreadCount = count; 
    },
    updateLastMessage: (state, action) => {
      const { roomId, lastMessage } = action.payload;
      state.lastMessage = lastMessage.text; 
    },
  },
});


export const { updateUnreadCount, updateLastMessage } = chatSlice.actions;

export default chatSlice.reducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  events: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'events/fetchAll',
  async (_, { getState }) => {
    const { auth } = getState();

    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/events/`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch events');
    return await response.json();
  }
);

export const createEvent = createAsyncThunk(
  'events/create',
  async (formData, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/events/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create event');
    }
    return await response.json();
  }
);

export const updateEvent = createAsyncThunk(
  'events/update',
  async ({ id, formData }, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/event/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update event');
    return await response.json();
  }
);

export const deleteEvent = createAsyncThunk(
  'events/delete',
  async (id, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/event/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete event');
    return id;
  }
);

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Events
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create Event
      .addCase(createEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events.push(action.payload);
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Event
      .addCase(updateEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEvent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.events.findIndex(e => e.id === action.payload.id);
        if (index !== -1) state.events[index] = action.payload;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete Event
      .addCase(deleteEvent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEvent.fulfilled, (state, action) => {
        state.loading = false;
        state.events = state.events.filter(e => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default eventsSlice.reducer;
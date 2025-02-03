import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const initialState = {
  groups: [],
  loading: false,
  error: null,
};

// Async Thunks
export const fetchGroups = createAsyncThunk(
  'groups/fetchAll',
  async (_, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/groups/`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Failed to fetch groups');
    return await response.json();
  }
);

export const createGroup = createAsyncThunk(
  'groups/create',
  async (groupData, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/groups/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create group');
    }
    return await response.json();
  }
);

export const updateGroup = createAsyncThunk(
  'groups/update',
  async ({ id, groupData }, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/groups/${id}/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(groupData),
    });
    if (!response.ok) throw new Error('Failed to update group');
    return await response.json();
  }
);

export const deleteGroup = createAsyncThunk(
  'groups/delete',
  async (id, { getState }) => {
    const { auth } = getState();
    const response = await fetch(`${import.meta.env.VITE_API_SERVER_DOMAIN}/groups/${id}/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to delete group');
    return id;
  }
);

const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Create Group
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups.push(action.payload);
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Update Group
      .addCase(updateGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateGroup.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.groups.findIndex(g => g.id === action.payload.id);
        if (index !== -1) state.groups[index] = action.payload;
      })
      .addCase(updateGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      
      // Delete Group
      .addCase(deleteGroup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = state.groups.filter(g => g.id !== action.payload);
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default groupsSlice.reducer;
import { createSlice } from '@reduxjs/toolkit'
import { fetchUser } from '../thunks/userThunks'

type UserState = { 
  id: string
  name: string
  email: string
  loading: boolean
}

const initialState: UserState = { 
  id: '', 
  name: '', 
  email: '',
  loading: false
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const { userId, username, email } = action.payload
        state.id = userId
        state.name = username
        state.email = email
        state.loading = false
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false
      })
  }
})

export default slice.reducer

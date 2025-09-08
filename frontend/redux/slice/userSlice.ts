import { createSlice } from '@reduxjs/toolkit'
import { fetchUser } from '../thunks/userThunks'

type UserState = { 
  id: string
  name: string
  email: string
}

const initialState: UserState = { 
  id: '', 
  name: '', 
  email: '' 
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const { userId, username, email } = action.payload
      state.id = userId
      state.name = username
      state.email = email
    })
  }
})

export default slice.reducer

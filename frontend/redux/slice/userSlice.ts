import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUser } from '../thunks/userThunks'

type UserState = {
  id: string
  username: string
  email: string
  role: string
  csrf_token: string
  loading: boolean
}

type ApiRes = {
  userId: string
  username: string
  email: string
  csrf_token: string
  role: string
}

const initialState: UserState = {
  id: '',
  username: '',
  email: '',
  role: '',
  csrf_token: '',
  loading: false,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogout: (state) => {
      state.id = ''
      state.username = ''
      state.email = ''
      state.role = ''
      state.csrf_token = ''
      state.loading = false
    },
    setLoggedIn: (state, action: PayloadAction<ApiRes>) => {
      state.id = action.payload.userId
      state.username = action.payload.username
      state.email = action.payload.email
      state.role = action.payload.role
      state.csrf_token = action.payload.csrf_token
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<ApiRes>) => {
        state.id = action.payload.userId.toString()
        state.username = action.payload.username
        state.email = action.payload.email
        state.role = action.payload.role
        state.csrf_token = action.payload.csrf_token
        state.loading = false
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setLogout, setLoggedIn } = slice.actions
export default slice.reducer

import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { fetchUser } from '../thunks/userThunks'

type UserState = {
  userId: string
  username: string
  email: string
  role: string
  csrf: string
  access_token: string
  loading: boolean
}

type ApiRes = {
  userId: string
  username: string
  email: string
  csrf: string
  access_token: string
  role: string
}

const initialState: UserState = {
  userId: '',
  username: '',
  email: '',
  role: '',
  csrf: '',
  access_token: '',
  loading: false,
}

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLogout: (state) => {
      state.userId = ''
      state.username = ''
      state.email = ''
      state.role = ''
      state.csrf = ''
      state.access_token = ''
      state.loading = false
    },
    setLoggedIn: (state, action: PayloadAction<UserState>) => {
      state.userId = action.payload.userId
      state.username = action.payload.username
      state.email = action.payload.email
      state.role = action.payload.role
      state.csrf = action.payload.csrf
      state.access_token = action.payload.access_token
      state.loading = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUser.fulfilled, (state, action: PayloadAction<ApiRes>) => {
        state.userId = action.payload.userId.toString()
        state.username = action.payload.username
        state.email = action.payload.email
        state.role = action.payload.role
        state.csrf = action.payload.csrf
        state.access_token = action.payload.access_token
        state.loading = false
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setLogout, setLoggedIn } = slice.actions
export default slice.reducer

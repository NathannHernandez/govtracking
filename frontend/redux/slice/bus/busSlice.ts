import { createSlice } from '@reduxjs/toolkit'
import { fetchBus, fetchRecentBus } from '../../thunks/busThunks'

type BusField = {
  id: number;
  userId: number;
  username: string;
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  encoded: string;
  issue: string;
  subjectOfChange: string;
  date: string;
};


type Bus = { 
  date: string
  encoded: number
  issues: number
  updated: number
}

type BusState = {
  recentBus : BusField[]
  dailyEncodingData: Bus[]
  currentData: BusField | null
  loading: boolean
  newData : boolean
}

const initialState: BusState = { 
  recentBus: [],
  dailyEncodingData: [],
  currentData: {
    id: 0,
    userId: 0,
    username: '',
    lgu: '',
    barangay: '',
    hhId: '',
    granteeName: '',
    typeOfUpdate: '',
    encoded: '',
    issue: '',
    subjectOfChange: '',
    date: ''
  },
  loading: true,
  newData : false
}

const slice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setCurrentData: (state, action: { payload: BusField }) => {
      state.currentData = action.payload
    },
    setNewData: (state, action: { payload: boolean }) => {
      state.newData = action.payload
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchBus.fulfilled, (state, action) => {
        state.dailyEncodingData = action.payload
        state.loading = false
      })
      .addCase(fetchBus.rejected, (state) => {
        state.loading = false
      })
      .addCase(fetchRecentBus.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchRecentBus.fulfilled, (state, action) => {
        console.log(action.payload)
        state.recentBus = action.payload
        state.loading = false
      })
      .addCase(fetchRecentBus.rejected, (state) => {
        state.loading = false
      })
  }
})


export const { setCurrentData, setNewData } = slice.actions
export default slice.reducer

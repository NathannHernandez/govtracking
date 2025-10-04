import { createSlice } from '@reduxjs/toolkit'
import { fetchBus, fetchRecentBus } from '../../thunks/busThunks'

type BusForm = {
  lgu: string;
  barangay: string;
  hhId: string;
  granteeName: string;
  typeOfUpdate: string;
  encoded: string;
  issue: string;
  subjectOfChange: string;
};

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
  createdAt: string
  updatedAt: string
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
  currentData: BusForm | null
  loading: boolean
  newData : boolean
}

const initialState: BusState = { 
  recentBus: [],
  dailyEncodingData: [],
  currentData: {
    lgu: '',
    barangay: '',
    hhId: '',
    granteeName: '',
    typeOfUpdate: '',
    encoded: '',
    issue: '',
    subjectOfChange: ''
  },
  loading: true,
  newData : false
}

const slice = createSlice({
  name: 'bus',
  initialState,
  reducers: {
    setCurrentData: (state, action: { payload: BusForm }) => {
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

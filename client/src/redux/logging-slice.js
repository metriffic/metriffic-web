import { createSlice } from '@reduxjs/toolkit'

const logging_slice = createSlice({
  name: 'logging',
  initialState: {
    log: [],
  },
  reducers: {
    set_log: (state, action) => {
        state.log = action.payload
    },
    logmsg: (state, action) => {
        state.log.push(action.payload)
    }
  }
})

export const {    
    set_log,
    logmsg
} = logging_slice.actions

export default logging_slice.reducer
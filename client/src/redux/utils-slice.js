import { createSlice } from '@reduxjs/toolkit'

const utils_slice = createSlice({
  name: 'utils',
  initialState: {
    user_name: {},
    modal_content: null
  },
  reducers: {
    set_user_name: (state, action) => {
        state.user_name = action.payload
    },
    set_modal_content: (state, action) => {
        state.modal_content = action.payload
    }
  }
})

export const {    
    set_user_name,
    set_modal_content   
} = utils_slice.actions

export default utils_slice.reducer
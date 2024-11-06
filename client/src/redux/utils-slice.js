import { createSlice } from '@reduxjs/toolkit'

const utils_slice = createSlice({
  name: 'utils',
  initialState: {
    logged_in_user: null,
    modal_content: null
  },
  reducers: {
    set_logged_in_user: (state, action) => {
        state.logged_in_user = action.payload
    },
    set_modal_content: (state, action) => {
        state.modal_content = action.payload
    }
  }
})

export const {    
    set_logged_in_user,
    set_modal_content   
} = utils_slice.actions

export default utils_slice.reducer
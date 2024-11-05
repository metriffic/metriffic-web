import { configureStore } from '@reduxjs/toolkit'

import utils_reducer from './utils-slice'
import logging_reducer from './logging-slice'


export const store = configureStore({
    reducer: {
        utils: utils_reducer,
        logging: logging_reducer
    },
    middleware: getDefaultMiddleware =>
                            getDefaultMiddleware({
                                serializableCheck: false,
                            })
})

import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.scss';
import Metriffic from './client';
import reportWebVitals from './reportWebVitals';

import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <Metriffic />
    </Provider>
);
    
reportWebVitals();

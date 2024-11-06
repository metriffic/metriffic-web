import React from 'react';
import ReactDOM from 'react-dom/client';
import './style.scss';
import Metriffic from './pages/mainpage';
import WhatIsThis from './pages/whatisthis';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from "react-redux";
import { store } from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Metriffic />} />
                <Route path="/whatisthis" element={<WhatIsThis />} />
            </Routes>
        </BrowserRouter>
    </Provider>
);


reportWebVitals();

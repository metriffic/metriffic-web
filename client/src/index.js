import React from 'react';
import ReactDOM from 'react-dom/client';
import Metriffic from './pages/mainpage';
import AboutPage from './pages/about';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Provider } from "react-redux";
import { store } from "./redux/store";

import './style.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Metriffic />} />
                <Route path="/about" element={<AboutPage />} />
            </Routes>
        </BrowserRouter>
    </Provider>
);


reportWebVitals();

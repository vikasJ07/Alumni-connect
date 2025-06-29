import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from "react";
import {Provider} from 'react-redux'
import { store } from './redux/store';
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <BrowserRouter>
   <Provider store={store}>
    <App />
  </Provider>
    </BrowserRouter>
  </StrictMode>,
)

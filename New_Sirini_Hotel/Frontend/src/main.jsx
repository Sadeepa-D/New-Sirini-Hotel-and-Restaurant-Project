<<<<<<< HEAD
import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
=======
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
>>>>>>> 659ac51203b45dc7f76f10990ad569bfbb6705e7

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <StrictMode>
      <App />
    </StrictMode>
  </BrowserRouter>,
);

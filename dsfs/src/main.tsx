// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { LoadingProvider } from "./context/LoadingContext";  // Import the context provider
import "./index.css";  // Make sure you have global styles

const rootElement = document.getElementById("root") as HTMLElement;
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Router>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Router>
  </React.StrictMode>
);

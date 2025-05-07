// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Global CSS (including Tailwind setup)
import { BrowserRouter as Router } from "react-router-dom";
import { LoadingProvider } from "./context/LoadingContext"; // Ensure you have a LoadingProvider to manage loading state

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <LoadingProvider>
        <App />
      </LoadingProvider>
    </Router>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";  

import { BrowserRouter } from "react-router-dom";  //  This should ONLY exist here

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <BrowserRouter>  {/*  Router should be here */}
            <App />
        </BrowserRouter>
    </React.StrictMode>
);

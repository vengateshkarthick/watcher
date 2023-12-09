import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./styles.css";


const root = ReactDOM.createRoot(document.querySelector("#app"));

root.render(
  <React.StrictMode>
    <App />
    <ToastContainer />
  </React.StrictMode>
);

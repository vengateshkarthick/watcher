import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "./style.css";



ReactDOM.render(
<React.StrictMode>
  <App />
  <ToastContainer />
 </React.StrictMode>,
 document.getElementById("app"),
);
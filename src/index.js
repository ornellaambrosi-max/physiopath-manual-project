// src/index.js
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

const container =
  document.getElementById("root") ||
  (() => {
    // fallback in caso il div#root non sia presente
    const el = document.createElement("div");
    el.id = "root";
    document.body.appendChild(el);
    return el;
  })();

const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

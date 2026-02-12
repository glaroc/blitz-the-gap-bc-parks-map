import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import i18n from "./i18n";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(<App />);

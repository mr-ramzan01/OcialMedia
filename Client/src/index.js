import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import "./index.css";
import App from "./App";
import theme from "./theme";
import { AuthContextprovider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import { ScrollToTop } from "./components/common/ScrollToTop";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <ToastProvider>
          <BrowserRouter>
            <ScrollToTop />
            <AuthContextprovider>
              <App />
            </AuthContextprovider>
          </BrowserRouter>
        </ToastProvider>
      </ErrorBoundary>
    </ThemeProvider>
  </React.StrictMode>,
);

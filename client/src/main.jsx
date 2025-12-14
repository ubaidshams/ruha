import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import store from "./store/store.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <App />
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#FFF0F5",
              color: "#2F4F4F",
              borderRadius: "24px",
              boxShadow: "0 8px 32px rgba(255, 105, 180, 0.3)",
            },
            success: {
              iconTheme: {
                primary: "#FF69B4",
                secondary: "#FFFFFF",
              },
            },
            error: {
              iconTheme: {
                primary: "#FF1744",
                secondary: "#FFFFFF",
              },
            },
          }}
        />
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

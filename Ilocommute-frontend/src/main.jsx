import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { AuthProviderWithGoogle } from "./context/AuthProvider.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <AuthProviderWithGoogle clientId={import.meta.env.VITE_CLIENT_ID}>
      <App />
    </AuthProviderWithGoogle>
  </BrowserRouter>
);

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import AppRouter from "./routes/AppRouter";
import { AuthProvider } from "./context/AuthContext";
import { CarritoProvider } from "./context/CarritoContext";

createRoot(document.getElementById("root")).render(<StrictMode> <AuthProvider> <CarritoProvider> <AppRouter /> </CarritoProvider> </AuthProvider> </StrictMode>
);

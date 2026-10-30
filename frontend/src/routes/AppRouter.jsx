import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import MiCuenta from "../pages/MiCuenta";

import ProtectedRoute from "./ProtectedRoute";
import Carrito from "../pages/Carrito";
import FinalizarCompra from "../pages/FinalizarCompra";

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Rutas públicas */}
                <Route path="/" element={<App />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Registro />} />
                <Route path="/carrito" element={<Carrito />} />
                <Route path="/finalizar-compra" element={<FinalizarCompra />} />

                {/* Rutas privadas */}
                <Route
                    path="/mi-cuenta"
                    element={
                        <ProtectedRoute>
                            <MiCuenta />
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
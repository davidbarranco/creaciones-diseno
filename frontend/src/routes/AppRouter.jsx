import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "../App";
import Login from "../pages/Login";
import Registro from "../pages/Registro";
import MiCuenta from "../pages/MiCuenta";
import Carrito from "../pages/Carrito";
import FinalizarCompra from "../pages/FinalizarCompra";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import AdminPedidos from "../pages/AdminPedidos";
import AdminProductos from "../pages/AdminProductos";

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

                {/* Ruta privada para clientes */}
                <Route
                    path="/mi-cuenta"
                    element={
                        <ProtectedRoute>
                            <MiCuenta />
                        </ProtectedRoute>
                    }
                />

                {/* Rutas exclusivas para administradores */}
                <Route path="/admin" element={<AdminRoute />}>
                    <Route path="pedidos" element={<AdminPedidos />} />
                    <Route path="productos" element={<AdminProductos />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;
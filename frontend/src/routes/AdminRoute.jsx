import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Protege las rutas exclusivas para administradores.
function AdminRoute() {
    const { autenticado, usuario } = useAuth();

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    if (!usuario || usuario.rol !== "ADMIN") {
        return <Navigate to="/mi-cuenta" replace />;
    }

    return <Outlet />;
}

export default AdminRoute;
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children }) {
    const { autenticado } = useAuth();

    // Redirige al login si el usuario no está autenticado
    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
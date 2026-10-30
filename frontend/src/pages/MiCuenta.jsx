import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MiCuenta() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();

    function cerrarSesion() {
        logout();
        navigate("/");
    }

    return (
        <main className="pagina-autenticacion">
            <section className="formulario-autenticacion">

                <h1>Mi cuenta</h1>

                <p>Bienvenido a Creaciones & Diseño.</p>

                <div>
                    <p><strong>Nombre:</strong> {usuario.nombre}</p>
                    <p><strong>Apellido:</strong> {usuario.apellido}</p>
                    <p><strong>Correo:</strong> {usuario.correo}</p>
                </div>

                <button onClick={cerrarSesion}>
                    Cerrar sesión
                </button>

            </section>
        </main>
    );
}

export default MiCuenta;
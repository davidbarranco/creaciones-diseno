import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [datos, setDatos] = useState({
        correo: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [cargando, setCargando] = useState(false);

    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setDatos({
            ...datos,
            [name]: value
        });
    }

    async function manejarLogin(evento) {
        evento.preventDefault();

        setError("");
        setCargando(true);

        try {
            await login(datos);

            navigate("/");

        } catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="pagina-autenticacion">

            <section className="formulario-autenticacion">

                <h1>Bienvenido</h1>

                <p>Ingresa a tu cuenta de Creaciones & Diseño.</p>

                {error && <div className="mensaje-error">{error}</div>}

                <form onSubmit={manejarLogin}>

                    <label>Correo electrónico</label>
                    <input
                        type="email"
                        name="correo"
                        value={datos.correo}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={datos.password}
                        onChange={manejarCambio}
                        required
                    />

                    <button type="submit" disabled={cargando}>
                        {cargando ? "Ingresando..." : "Iniciar sesión"}
                    </button>

                </form>

                <p>
                    ¿No tienes una cuenta? <Link to="/registro">Regístrate</Link>
                </p>

            </section>

        </main>
    );
}

export default Login;
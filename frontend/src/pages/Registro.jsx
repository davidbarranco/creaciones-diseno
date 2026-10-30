import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Registro() {

    const navigate = useNavigate();
    const { registrar } = useAuth();

    const [datos, setDatos] = useState({
        nombre: "",
        apellido: "",
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

    async function manejarRegistro(evento) {
        evento.preventDefault();

        setError("");
        setCargando(true);

        try {
            await registrar(datos);

            alert("¡Tu cuenta fue creada correctamente!");

            navigate("/login");

        } catch (error) {
            setError(error.message);

        } finally {
            setCargando(false);
        }
    }

    return (
        <main className="pagina-autenticacion">

            <section className="formulario-autenticacion">

                <h1>Crear cuenta</h1>

                <p>Regístrate para disfrutar de nuestros productos.</p>

                {error && <div className="mensaje-error">{error}</div>}

                <form onSubmit={manejarRegistro}>

                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={datos.nombre}
                        onChange={manejarCambio}
                        required
                    />

                    <label>Apellido</label>
                    <input
                        type="text"
                        name="apellido"
                        value={datos.apellido}
                        onChange={manejarCambio}
                        required
                    />

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
                        {cargando ? "Registrando..." : "Crear cuenta"}
                    </button>

                </form>

                <p>
                    ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
                </p>

            </section>

        </main>
    );
}

export default Registro;
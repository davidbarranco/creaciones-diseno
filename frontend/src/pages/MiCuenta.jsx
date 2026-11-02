
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function MiCuenta() {
    const { usuario, logout } = useAuth();
    const navigate = useNavigate();


    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Consulta el historial de pedidos del usuario autenticado.
    useEffect(function () {
        async function obtenerPedidos() {
            try {
                const token = localStorage.getItem("token");

                const respuesta = await fetch(
                    `${import.meta.env.VITE_API_URL}/pedidos/mis-pedidos`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const datos = await respuesta.json();

                if (!respuesta.ok) {
                    throw new Error(datos.mensaje || "No fue posible consultar los pedidos.");
                }

                setPedidos(datos.pedidos);

            } catch (error) {
                console.error("Error al consultar los pedidos:", error);
                setError(error.message);

            } finally {
                setCargando(false);
            }
        }

        obtenerPedidos();
    }, []);

    function cerrarSesion() {
        logout();
        navigate("/");
    }

    // Convierte los valores numéricos a pesos colombianos.
    function formatoMoneda(valor) {
        return Number(valor).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
    }

    // Presenta la fecha del pedido en formato colombiano.
    function formatoFecha(fecha) {
        return new Date(fecha).toLocaleDateString("es-CO", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    }

    return (
        <main className="pagina-mi-cuenta">

            <section className="cuenta-contenedor">

                {/* Información del usuario */}
                <section className="cuenta-perfil">

                    <div className="cuenta-perfil-encabezado">
                        <span className="cuenta-etiqueta">MI ESPACIO</span>
                        <h1>Mi cuenta</h1>
                        <p>Bienvenido a Creaciones & Diseño.</p>
                    </div>

                    <div className="cuenta-datos">
                        <div className="cuenta-dato">
                            <span>Nombre</span>
                            <strong>{usuario.nombre}</strong>
                        </div>

                        <div className="cuenta-dato">
                            <span>Apellido</span>
                            <strong>{usuario.apellido}</strong>
                        </div>

                        <div className="cuenta-dato cuenta-dato-completo">
                            <span>Correo electrónico</span>
                            <strong>{usuario.correo}</strong>
                        </div>
                    </div>

                    <button
                        className="boton-cerrar-sesion"
                        onClick={cerrarSesion}
                    >
                        Cerrar sesión
                    </button>

                </section>

                {/* Historial de pedidos */}
                <section className="historial-pedidos">

                    <div className="historial-encabezado">
                        <div>
                            <span className="cuenta-etiqueta">TUS COMPRAS</span>
                            <h2>Historial de pedidos</h2>
                            <p>Consulta los detalles de tus compras.</p>
                        </div>

                        <span className="contador-pedidos">
                            {pedidos.length} {pedidos.length === 1 ? "pedido" : "pedidos"}
                        </span>
                    </div>

                    {cargando && (
                        <div className="estado-historial">
                            <p>Cargando tu historial de pedidos...</p>
                        </div>
                    )}

                    {error && (
                        <div className="estado-historial estado-error">
                            <p>{error}</p>
                        </div>
                    )}

                    {!cargando && !error && pedidos.length === 0 && (
                        <div className="estado-historial estado-vacio">
                            <h3>Aún no tienes pedidos</h3>
                            <p>
                                Cuando realices tu primera compra,
                                podrás consultar aquí toda la información.
                            </p>
                        </div>
                    )}

                    {!cargando && !error && pedidos.map(function (pedido) {
                        return (
                            <article key={pedido.id} className="pedido-card">

                                <div className="pedido-encabezado">

                                    <div>
                                        <span className="pedido-referencia">
                                            REFERENCIA
                                        </span>

                                        <h3>Pedido #{pedido.id}</h3>

                                        <p className="pedido-fecha">
                                            {formatoFecha(pedido.fechaCreacion)}
                                        </p>
                                    </div>

                                    <span className={`estado-pedido estado-${pedido.estado.toLowerCase()}`}>
                                        {pedido.estado}
                                    </span>

                                </div>

                                <div className="pedido-productos">

                                    <h4>Productos de tu pedido</h4>

                                    {pedido.detalles.map(function (producto) {
                                        return (
                                            <div
                                                key={producto.id}
                                                className="pedido-producto"
                                            >

                                                <div className="pedido-producto-info">
                                                    <strong>{producto.nombreProducto}</strong>
                                                    <span>
                                                        Cantidad: {producto.cantidad}
                                                    </span>
                                                </div>

                                                <div className="pedido-producto-precio">
                                                    <span>
                                                        {formatoMoneda(producto.precio)}
                                                    </span>

                                                    <strong>
                                                        {formatoMoneda(producto.subtotal)}
                                                    </strong>
                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>

                                <div className="pedido-pie">
                                    <span>Total del pedido</span>
                                    <strong>{formatoMoneda(pedido.total)}</strong>
                                </div>

                                {/* Información de entrega */}
                                <div className="pedido-entrega">

                                    <h4>Información de entrega</h4>

                                    <div className="pedido-entrega-datos">

                                        <div>
                                            <span>Destinatario</span>
                                            <strong>{pedido.nombre} {pedido.apellido}</strong>
                                        </div>

                                        <div>
                                            <span>Teléfono</span>
                                            <strong>{pedido.telefono}</strong>
                                        </div>

                                        <div>
                                            <span>Dirección</span>
                                            <strong>{pedido.direccion}</strong>
                                        </div>

                                        <div>
                                            <span>Ciudad</span>
                                            <strong>{pedido.ciudad}</strong>
                                        </div>

                                        <div>
                                            <span>Departamento</span>
                                            <strong>{pedido.departamento}</strong>
                                        </div>

                                        <div>
                                            <span>Correo electrónico</span>
                                            <strong>{pedido.correo}</strong>
                                        </div>

                                        {pedido.indicaciones && (
                                            <div className="entrega-indicaciones">
                                                <span>Indicaciones adicionales</span>
                                                <strong>{pedido.indicaciones}</strong>
                                            </div>
                                        )}

                                    </div>

                                </div>

                            </article>
                        );
                    })}

                </section>

            </section>

        </main>
    );


}

export default MiCuenta;

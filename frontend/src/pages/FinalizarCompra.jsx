import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function FinalizarCompra() {
    const {
        carrito,
        totalCarrito,
        vaciarCarrito
    } = useCarrito();

    const { usuario, autenticado } = useAuth();

    const navigate = useNavigate();

    const [datosEntrega, setDatosEntrega] = useState({
        nombre: usuario?.nombre || "",
        apellido: usuario?.apellido || "",
        correo: usuario?.correo || "",
        telefono: "",
        direccion: "",
        ciudad: "",
        departamento: "",
        indicaciones: ""
    });

    const [error, setError] = useState("");
    const [procesando, setProcesando] = useState(false);

    // Actualiza los campos del formulario.
    function manejarCambio(evento) {
        const { name, value } = evento.target;

        setDatosEntrega(function (datosAnteriores) {
            return {
                ...datosAnteriores,
                [name]: value
            };
        });
    }

    // Valida los datos y envía el pedido al backend.
    async function manejarEnvio(evento) {
        evento.preventDefault();

        setError("");

        if (!autenticado) {
            navigate("/login");
            return;
        }

        if (carrito.length === 0) {
            setError("Tu carrito está vacío.");
            return;
        }

        const camposObligatorios = [
            "nombre",
            "apellido",
            "correo",
            "telefono",
            "direccion",
            "ciudad",
            "departamento"
        ];

        const hayCamposVacios = camposObligatorios.some(function (campo) {
            return !datosEntrega[campo].trim();
        });

        if (hayCamposVacios) {
            setError("Por favor, completa todos los campos obligatorios.");
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setError("No encontramos tu sesión. Inicia sesión nuevamente.");
            return;
        }

        setProcesando(true);

        try {
            const respuesta = await fetch(
                `${import.meta.env.VITE_API_URL}/pedidos`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        datosEntrega: datosEntrega,
                        productos: carrito.map(function (producto) {
                            return {
                                id: producto.id,
                                cantidad: producto.cantidad
                            };
                        })
                    })
                }
            );

            const resultado = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    resultado.mensaje || "No fue posible registrar el pedido."
                );
            }

            console.log("Pedido registrado:", resultado.pedido);

            vaciarCarrito();

            alert(
                `¡Pedido registrado correctamente!\nNúmero de pedido: ${resultado.pedido.id}`
            );

            navigate("/");

        } catch (error) {
            console.error("Error al registrar el pedido:", error);

            setError(
                error.message || "Ocurrió un error al procesar tu pedido."
            );

        } finally {
            setProcesando(false);
        }
    }

    // Formatea los valores monetarios en pesos colombianos.
    const formatoPrecio = function (precio) {
        return precio.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
    };

    if (carrito.length === 0) {
        return (
            <main className="pagina-carrito">
                <div className="carrito-vacio">
                    <h2>No tienes productos para comprar</h2>

                    <p>
                        Agrega productos a tu carrito antes de continuar.
                    </p>

                    <Link to="/" className="boton-finalizar-compra">
                        Ver productos
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="pagina-carrito">
            <div className="carrito-contenedor">

                <div className="carrito-encabezado">
                    <h1>Finalizar compra</h1>

                    <p>
                        Completa tus datos para realizar tu pedido.
                    </p>
                </div>

                <div className="finalizar-compra-contenido">

                    <form
                        className="formulario-entrega"
                        onSubmit={manejarEnvio}
                    >
                        <h2>Datos de entrega</h2>

                        {error && (
                            <p className="mensaje-error">
                                {error}
                            </p>
                        )}

                        <div className="campos-formulario">

                            <div className="campo-formulario">
                                <label htmlFor="nombre">Nombre</label>

                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={datosEntrega.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="apellido">Apellido</label>

                                <input
                                    type="text"
                                    id="apellido"
                                    name="apellido"
                                    value={datosEntrega.apellido}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="correo">
                                    Correo electrónico
                                </label>

                                <input
                                    type="email"
                                    id="correo"
                                    name="correo"
                                    value={datosEntrega.correo}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="telefono">Teléfono</label>

                                <input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={datosEntrega.telefono}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario campo-completo">
                                <label htmlFor="direccion">
                                    Dirección de entrega
                                </label>

                                <input
                                    type="text"
                                    id="direccion"
                                    name="direccion"
                                    value={datosEntrega.direccion}
                                    onChange={manejarCambio}
                                    placeholder="Ejemplo: Calle 45 # 20-30"
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="ciudad">Ciudad</label>

                                <input
                                    type="text"
                                    id="ciudad"
                                    name="ciudad"
                                    value={datosEntrega.ciudad}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label htmlFor="departamento">
                                    Departamento
                                </label>

                                <input
                                    type="text"
                                    id="departamento"
                                    name="departamento"
                                    value={datosEntrega.departamento}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario campo-completo">
                                <label htmlFor="indicaciones">
                                    Indicaciones adicionales (opcional)
                                </label>

                                <textarea
                                    id="indicaciones"
                                    name="indicaciones"
                                    value={datosEntrega.indicaciones}
                                    onChange={manejarCambio}
                                    rows="3"
                                />
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="boton-finalizar-compra"
                            disabled={procesando}
                        >
                            {procesando
                                ? "Registrando pedido..."
                                : "Confirmar pedido"}
                        </button>

                    </form>

                    <aside className="resumen-compra">

                        <h2>Resumen de tu compra</h2>

                        {carrito.map(function (producto) {
                            return (
                                <div
                                    className="resumen-producto"
                                    key={producto.id}
                                >
                                    <div>
                                        <h3>{producto.nombre}</h3>

                                        <p>
                                            Cantidad: {producto.cantidad}
                                        </p>
                                    </div>

                                    <span>
                                        {formatoPrecio(
                                            producto.precio * producto.cantidad
                                        )}
                                    </span>
                                </div>
                            );
                        })}

                        <div className="resumen-total">
                            <span>Total</span>

                            <strong>
                                {formatoPrecio(totalCarrito)}
                            </strong>
                        </div>

                        <Link
                            to="/carrito"
                            className="seguir-comprando"
                        >
                            Volver al carrito
                        </Link>

                    </aside>

                </div>
            </div>
        </main>
    );
}

export default FinalizarCompra;
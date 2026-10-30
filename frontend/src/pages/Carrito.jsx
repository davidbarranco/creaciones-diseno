import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import { useAuth } from "../context/AuthContext";

function Carrito() {
    const {
        carrito,
        cantidadProductos,
        totalCarrito,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto
    } = useCarrito();


    const { autenticado } = useAuth();
    const navigate = useNavigate();

    function formatearPrecio(precio) {
        return precio.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
    }

    function finalizarCompra() {
        if (!autenticado) {
            navigate("/login");
            return;
        }

        navigate("/finalizar-compra");
    }

    return (
        <main className="pagina-carrito">

            <div className="carrito-contenedor">

                <div className="carrito-encabezado">
                    <span className="texto-superior">
                        TU SELECCIÓN
                    </span>

                    <h1>Mi carrito</h1>

                    <p>
                        Revisa tus productos antes de continuar.
                    </p>
                </div>

                {carrito.length === 0 ? (

                    <div className="carrito-vacio">
                        <h2>Tu carrito está vacío</h2>

                        <p>
                            Todavía no has agregado productos.
                        </p>

                        <Link to="/" className="boton-principal">
                            Explorar productos →
                        </Link>
                    </div>

                ) : (

                    <div className="carrito-contenido">

                        <section className="carrito-productos">

                            <div className="carrito-total-productos">
                                {cantidadProductos} unidades en tu carrito
                            </div>

                            {carrito.map(function (producto) {
                                return (
                                    <article
                                        className="carrito-producto"
                                        key={producto.id}
                                    >

                                        <img
                                            src={producto.imagen}
                                            alt={producto.nombre}
                                        />

                                        <div className="carrito-producto-info">

                                            <span>
                                                {producto.categoria}
                                            </span>

                                            <h3>{producto.nombre}</h3>

                                            <strong>
                                                {formatearPrecio(producto.precio)}
                                            </strong>

                                            <div className="carrito-cantidad">

                                                <button
                                                    onClick={function () {
                                                        disminuirCantidad(producto.id);
                                                    }}
                                                >
                                                    −
                                                </button>

                                                <span>{producto.cantidad}</span>

                                                <button
                                                    onClick={function () {
                                                        aumentarCantidad(producto.id);
                                                    }}
                                                >
                                                    +
                                                </button>

                                            </div>

                                            <button
                                                className="carrito-eliminar"
                                                onClick={function () {
                                                    eliminarProducto(producto.id);
                                                }}
                                            >
                                                Eliminar
                                            </button>

                                        </div>

                                        <strong className="carrito-subtotal">
                                            {formatearPrecio(
                                                producto.precio * producto.cantidad
                                            )}
                                        </strong>

                                    </article>
                                );
                            })}

                        </section>

                        <aside className="carrito-resumen">

                            <h2>Resumen de compra</h2>

                            <div className="resumen-linea">
                                <span>Productos</span>
                                <span>{cantidadProductos}</span>
                            </div>

                            <div className="resumen-linea resumen-total">
                                <strong>Total</strong>
                                <strong>
                                    {formatearPrecio(totalCarrito)}
                                </strong>
                            </div>

                            <button
                                className="boton-finalizar-compra"
                                onClick={finalizarCompra}
                            >
                                Finalizar compra
                            </button>

                            <Link to="/" className="seguir-comprando">
                                Seguir comprando
                            </Link>

                        </aside>

                    </div>

                )}

            </div>

        </main>
    );


}

export default Carrito;

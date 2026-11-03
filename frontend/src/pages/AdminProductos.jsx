
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    obtenerProductosAdmin,
    crearProducto,
    actualizarProducto,
    desactivarProducto,
} from "../services/admin.service";

import "./AdminProductos.css";

// Tallas disponibles para los productos que manejan tallas.
const TALLAS = ["S", "M", "L", "XL", "XXL", "XXXL"];

// Datos iniciales del formulario.
const FORMULARIO_INICIAL = {
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    imagen: "",
    requiereTalla: false,
    stock: 0,
    variantes: TALLAS.map(function (talla) {
        return {
            talla: talla,
            stock: 0,
        };
    }),
};

// Construir la URL completa para mostrar imágenes almacenadas en el servidor.
function obtenerUrlImagen(imagen) {
    if (!imagen) {
        return "";
    }

    // Mantener las URL externas y las vistas previas temporales.
    if (
        imagen.startsWith("http") ||
        imagen.startsWith("blob:")
    ) {
        return imagen;
    }

    // Obtener la dirección base del backend.
    const apiUrl =
        import.meta.env.VITE_API_URL ||
        "http://localhost:3000/api/v1";

    // Obtener únicamente el origen del servidor.
    const origenServidor = new URL(apiUrl).origin;

    // Construir la dirección completa de la imagen.
    return new URL(imagen, `${origenServidor}/`).href;
}

function AdminProductos() {
    const [productos, setProductos] = useState([]);
    const [formulario, setFormulario] = useState(FORMULARIO_INICIAL);

    // Almacena el archivo de imagen seleccionado.
    const [archivoImagen, setArchivoImagen] = useState(null);

    // Almacena la dirección temporal de la vista previa.
    const [vistaPrevia, setVistaPrevia] = useState("");

    const [productoEditando, setProductoEditando] = useState(null);
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [cargando, setCargando] = useState(true);
    const [guardando, setGuardando] = useState(false);
    const [error, setError] = useState("");
    const [mensaje, setMensaje] = useState("");

    // Consultar los productos registrados.
    async function cargarProductos() {
        try {
            setCargando(true);
            setError("");

            const datos = await obtenerProductosAdmin();

            setProductos(datos);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    // Cargar los productos cuando se abre el componente.
    useEffect(function () {
        cargarProductos();
    }, []);

    // Actualizar los campos del formulario.
    function manejarCambio(evento) {
        const { name, value, type, checked } = evento.target;

        setFormulario(function (anterior) {
            return {
                ...anterior,
                [name]: type === "checkbox" ? checked : value,
            };
        });

        // Si se modifica la URL, se deja de utilizar el archivo seleccionado.
        if (name === "imagen") {
            setArchivoImagen(null);
            setVistaPrevia(value);
        }
    }

    // Gestionar la selección de una imagen desde el computador.
    function manejarSeleccionImagen(evento) {
        const archivo = evento.target.files[0];

        if (!archivo) {
            return;
        }

        const formatosPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        // Validar el formato de la imagen.
        if (!formatosPermitidos.includes(archivo.type)) {
            setError("Selecciona una imagen JPG, PNG o WEBP.");
            evento.target.value = "";
            return;
        }

        // Validar que la imagen no supere los 5 MB.
        if (archivo.size > 5 * 1024 * 1024) {
            setError("La imagen no puede superar los 5 MB.");
            evento.target.value = "";
            return;
        }

        setError("");
        setArchivoImagen(archivo);

        // Crear una URL temporal para visualizar la imagen seleccionada.
        setVistaPrevia(URL.createObjectURL(archivo));

        // Limpiar la URL escrita anteriormente.
        setFormulario(function (anterior) {
            return {
                ...anterior,
                imagen: "",
            };
        });
    }

    // Actualizar el inventario de una talla.
    function manejarCambioTalla(talla, stock) {
        setFormulario(function (anterior) {
            return {
                ...anterior,
                variantes: anterior.variantes.map(function (variante) {
                    if (variante.talla === talla) {
                        return {
                            ...variante,
                            stock: Number(stock),
                        };
                    }

                    return variante;
                }),
            };
        });
    }

    // Abrir el formulario para registrar un producto.
    function nuevoProducto() {
        setProductoEditando(null);

        setFormulario({
            ...FORMULARIO_INICIAL,
            variantes: TALLAS.map(function (talla) {
                return {
                    talla: talla,
                    stock: 0,
                };
            }),
        });

        setArchivoImagen(null);
        setVistaPrevia("");
        setMostrarFormulario(true);
        setError("");
        setMensaje("");
    }

    // Abrir el formulario con los datos del producto seleccionado.
    function editarProducto(producto) {
        setProductoEditando(producto.id);
        setArchivoImagen(null);

        setVistaPrevia(obtenerUrlImagen(producto.imagen));

        setFormulario({
            nombre: producto.nombre || "",
            descripcion: producto.descripcion || "",
            precio: producto.precio || "",
            categoria: producto.categoria || "",
            imagen: producto.imagen || "",
            requiereTalla: producto.requiereTalla || false,
            stock: producto.stock || 0,

            variantes: TALLAS.map(function (talla) {
                const variante = (producto.variantes || []).find(
                    function (item) {
                        return item.talla === talla;
                    }
                );

                return {
                    talla: talla,
                    stock: variante ? variante.stock : 0,
                };
            }),
        });

        setMostrarFormulario(true);
        setError("");
        setMensaje("");
    }

    // Cancelar el formulario y limpiar los datos temporales.
    function cancelarFormulario() {
        setMostrarFormulario(false);
        setProductoEditando(null);
        setFormulario(FORMULARIO_INICIAL);
        setArchivoImagen(null);
        setVistaPrevia("");
        setError("");
    }

    // Registrar o actualizar un producto.
    async function guardarProducto(evento) {
        evento.preventDefault();

        setError("");
        setMensaje("");

        // Validar los campos obligatorios.
        if (
            !formulario.nombre.trim() ||
            !formulario.categoria.trim() ||
            !formulario.precio ||
            Number(formulario.precio) <= 0
        ) {
            setError(
                "Completa el nombre, categoría y precio correctamente."
            );
            return;
        }

        // Preparar los datos que se enviarán al backend.
        const datos = {
            nombre: formulario.nombre.trim(),
            descripcion: formulario.descripcion.trim(),
            precio: Number(formulario.precio),
            categoria: formulario.categoria.trim(),

            // Enviar el archivo seleccionado o utilizar la URL ingresada.
            imagen: archivoImagen || formulario.imagen.trim(),

            requiereTalla: formulario.requiereTalla,

            stock: formulario.requiereTalla
                ? 0
                : Number(formulario.stock),

            variantes: formulario.requiereTalla
                ? formulario.variantes
                    .map(function (variante) {
                        return {
                            talla: variante.talla,
                            stock: Number(variante.stock),
                        };
                    })
                    .filter(function (variante) {
                        return variante.stock > 0;
                    })
                : [],
        };

        // Validar inventario.
        if (!formulario.requiereTalla && datos.stock < 0) {
            setError("El inventario no puede ser negativo.");
            return;
        }

        setGuardando(true);

        try {
            if (productoEditando !== null) {
                await actualizarProducto(productoEditando, datos);

                setMensaje("Producto actualizado correctamente.");
            } else {
                await crearProducto(datos);

                setMensaje("Producto registrado correctamente.");
            }

            // Cerrar el formulario.
            setMostrarFormulario(false);
            setProductoEditando(null);
            setFormulario(FORMULARIO_INICIAL);
            setArchivoImagen(null);
            setVistaPrevia("");

            // Actualizar el catálogo administrativo.
            await cargarProductos();

            setMensaje(
                productoEditando !== null
                    ? "Producto actualizado correctamente."
                    : "Producto registrado correctamente."
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setGuardando(false);
        }
    }

    // Desactivar un producto.
    async function manejarDesactivacion(producto) {
        const confirmar = window.confirm(
            `¿Deseas desactivar el producto "${producto.nombre}"?`
        );

        if (!confirmar) {
            return;
        }

        setError("");
        setMensaje("");

        try {
            await desactivarProducto(producto.id);

            setMensaje("Producto desactivado correctamente.");

            await cargarProductos();
        } catch (error) {
            setError(error.message);
        }
    }

    // Formatear los precios en pesos colombianos.
    function formatearPrecio(precio) {
        return Number(precio).toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        });
    }

    return (
        <main className="admin-productos">

            {/* Encabezado del módulo administrativo. */}
            <header className="admin-productos-header">
                <div>
                    <span className="admin-etiqueta">
                        PANEL ADMINISTRATIVO
                    </span>

                    <h1>Administración de productos</h1>

                    <p>
                        Gestiona el catálogo de Creaciones & Diseño.
                    </p>
                </div>

                <Link to="/admin" className="btn-volver">
                    Volver al panel
                </Link>
            </header>

            {/* Mensajes de respuesta. */}
            {mensaje && (
                <div className="mensaje-exito">
                    {mensaje}
                </div>
            )}

            {error && (
                <div className="mensaje-error">
                    {error}
                </div>
            )}

            {/* Resumen de productos. */}
            <section className="admin-productos-resumen">

                <div className="resumen-card">
                    <span>Total de productos</span>
                    <strong>{productos.length}</strong>
                </div>

                <div className="resumen-card">
                    <span>Productos activos</span>

                    <strong>
                        {productos.filter(function (producto) {
                            return producto.disponible;
                        }).length}
                    </strong>
                </div>

                <div className="resumen-card">
                    <span>Productos inactivos</span>

                    <strong>
                        {productos.filter(function (producto) {
                            return !producto.disponible;
                        }).length}
                    </strong>
                </div>

            </section>

            {/* Administración del catálogo. */}
            <section className="admin-productos-contenido">

                <div className="admin-productos-titulo">
                    <h2>Catálogo de productos</h2>

                    <button
                        type="button"
                        className="btn-nuevo-producto"
                        onClick={nuevoProducto}
                    >
                        + Nuevo producto
                    </button>
                </div>

                {/* Formulario de creación y edición. */}
                {mostrarFormulario && (
                    <form
                        className="producto-formulario"
                        onSubmit={guardarProducto}
                    >
                        <h2>
                            {productoEditando !== null
                                ? "Editar producto"
                                : "Registrar producto"}
                        </h2>

                        <div className="formulario-grid">

                            <div className="campo-formulario">
                                <label>Nombre del producto *</label>

                                <input
                                    type="text"
                                    name="nombre"
                                    value={formulario.nombre}
                                    onChange={manejarCambio}
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label>Categoría *</label>

                                <input
                                    type="text"
                                    name="categoria"
                                    value={formulario.categoria}
                                    onChange={manejarCambio}
                                    placeholder="Ejemplo: Camisetas"
                                    required
                                />
                            </div>

                            <div className="campo-formulario">
                                <label>Precio (COP) *</label>

                                <input
                                    type="number"
                                    name="precio"
                                    value={formulario.precio}
                                    onChange={manejarCambio}
                                    min="1"
                                    step="1"
                                    required
                                />
                            </div>

                            {/* Selección de imagen desde el computador. */}
                            <div className="campo-formulario campo-completo">
                                <label>
                                    Seleccionar imagen desde el computador
                                </label>

                                <input
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp"
                                    onChange={manejarSeleccionImagen}
                                />

                                <small>
                                    Formatos permitidos: JPG, PNG y WEBP.
                                    Máximo 5 MB.
                                </small>
                            </div>

                            {/* Alternativa para utilizar una URL. */}
                            <div className="campo-formulario campo-completo">
                                <label>O utilizar una URL de imagen</label>

                                <input
                                    type="url"
                                    name="imagen"
                                    value={formulario.imagen}
                                    onChange={manejarCambio}
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="campo-formulario campo-completo">
                                <label>Descripción</label>

                                <textarea
                                    name="descripcion"
                                    value={formulario.descripcion}
                                    onChange={manejarCambio}
                                    rows="4"
                                />
                            </div>

                        </div>

                        {/* Configuración de tallas. */}
                        <div className="campo-tallas">
                            <label className="checkbox-tallas">
                                <input
                                    type="checkbox"
                                    name="requiereTalla"
                                    checked={formulario.requiereTalla}
                                    onChange={manejarCambio}
                                />

                                Este producto maneja tallas.
                            </label>
                        </div>

                        {formulario.requiereTalla ? (
                            <div className="inventario-tallas">

                                <h3>Inventario por talla</h3>

                                <div className="tallas-grid">

                                    {formulario.variantes.map(
                                        function (variante) {
                                            return (
                                                <div
                                                    className="campo-formulario"
                                                    key={variante.talla}
                                                >
                                                    <label>
                                                        Talla {variante.talla}
                                                    </label>

                                                    <input
                                                        type="number"
                                                        min="0"
                                                        value={variante.stock}
                                                        onChange={function (evento) {
                                                            manejarCambioTalla(
                                                                variante.talla,
                                                                evento.target.value
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            );
                                        }
                                    )}

                                </div>
                            </div>
                        ) : (
                            <div className="campo-formulario campo-stock">
                                <label>Inventario disponible</label>

                                <input
                                    type="number"
                                    name="stock"
                                    min="0"
                                    value={formulario.stock}
                                    onChange={manejarCambio}
                                />
                            </div>
                        )}

                        {/* Vista previa de la imagen seleccionada o registrada. */}
                        {(vistaPrevia || formulario.imagen) && (
                            <div className="vista-previa-imagen">

                                <span>Vista previa:</span>

                                <img
                                    src={
                                        vistaPrevia ||
                                        obtenerUrlImagen(formulario.imagen)
                                    }
                                    alt="Vista previa del producto"
                                    onError={function (evento) {
                                        evento.target.style.display = "none";
                                    }}
                                />

                            </div>
                        )}

                        {/* Botones del formulario. */}
                        <div className="formulario-acciones">

                            <button
                                type="submit"
                                className="btn-guardar"
                                disabled={guardando}
                            >
                                {guardando
                                    ? "Guardando..."
                                    : productoEditando !== null
                                        ? "Guardar cambios"
                                        : "Registrar producto"}
                            </button>

                            <button
                                type="button"
                                className="btn-cancelar"
                                onClick={cancelarFormulario}
                                disabled={guardando}
                            >
                                Cancelar
                            </button>

                        </div>

                    </form>
                )}

                {/* Tabla de productos registrados. */}
                {cargando ? (
                    <p className="estado-cargando">
                        Cargando productos...
                    </p>
                ) : productos.length === 0 ? (
                    <p className="estado-vacio">
                        No hay productos registrados.
                    </p>
                ) : (
                    <div className="tabla-productos-contenedor">

                        <table className="tabla-productos">

                            <thead>
                                <tr>
                                    <th>Imagen</th>
                                    <th>Producto</th>
                                    <th>Categoría</th>
                                    <th>Precio</th>
                                    <th>Inventario</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>

                            <tbody>

                                {productos.map(function (producto) {
                                    const stockVariantes =
                                        producto.variantes || [];

                                    return (
                                        <tr key={producto.id}>

                                            <td>
                                                {producto.imagen ? (
                                                    <img
                                                        className="producto-miniatura"
                                                        src={obtenerUrlImagen(
                                                            producto.imagen
                                                        )}
                                                        alt={producto.nombre}
                                                        onError={function (evento) {
                                                            evento.target.style.display = "none";
                                                        }}
                                                    />
                                                ) : (
                                                    <span>Sin imagen</span>
                                                )}
                                            </td>

                                            <td>
                                                <strong>
                                                    {producto.nombre}
                                                </strong>
                                            </td>

                                            <td>
                                                {producto.categoria}
                                            </td>

                                            <td>
                                                {formatearPrecio(
                                                    producto.precio
                                                )}
                                            </td>

                                            <td>
                                                {producto.requiereTalla ? (
                                                    <div className="inventario-resumen">

                                                        {stockVariantes.length > 0
                                                            ? stockVariantes.map(
                                                                function (variante) {
                                                                    return (
                                                                        <span
                                                                            key={
                                                                                variante.id ||
                                                                                variante.talla
                                                                            }
                                                                        >
                                                                            {variante.talla}:{" "}
                                                                            {variante.stock}
                                                                        </span>
                                                                    );
                                                                }
                                                            )
                                                            : "Sin inventario"}

                                                    </div>
                                                ) : (
                                                    producto.stock
                                                )}
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        producto.disponible
                                                            ? "estado-activo"
                                                            : "estado-inactivo"
                                                    }
                                                >
                                                    {producto.disponible
                                                        ? "Activo"
                                                        : "Inactivo"}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="acciones-producto">

                                                    <button
                                                        type="button"
                                                        className="btn-editar"
                                                        onClick={function () {
                                                            editarProducto(
                                                                producto
                                                            );
                                                        }}
                                                    >
                                                        Editar
                                                    </button>

                                                    {producto.disponible && (
                                                        <button
                                                            type="button"
                                                            className="btn-desactivar"
                                                            onClick={function () {
                                                                manejarDesactivacion(
                                                                    producto
                                                                );
                                                            }}
                                                        >
                                                            Desactivar
                                                        </button>
                                                    )}

                                                </div>
                                            </td>

                                        </tr>
                                    );
                                })}

                            </tbody>

                        </table>

                    </div>
                )}

            </section>

        </main>
    );
}

export default AdminProductos;


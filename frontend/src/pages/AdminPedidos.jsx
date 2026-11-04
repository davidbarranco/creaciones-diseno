import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    obtenerPedidos,
    actualizarEstadoPedido
} from "../services/admin.service";

function AdminPedidos() {
    const [pedidos, setPedidos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");

    // Consulta los pedidos al cargar la página.
    async function cargarPedidos() {
        try {
            setCargando(true);
            setError("");

            const datos = await obtenerPedidos();

            // Admite respuestas que contengan directamente el arreglo
            // o que lo agrupen dentro de la propiedad pedidos.
            const listaPedidos = Array.isArray(datos)
                ? datos
                : datos.pedidos;

            setPedidos(Array.isArray(listaPedidos) ? listaPedidos : []);
        } catch (error) {
            setError(error.message);
        } finally {
            setCargando(false);
        }
    }

    useEffect(() => {
        cargarPedidos();
    }, []);

    // Actualiza el estado de un pedido.
    async function cambiarEstado(id, estado) {
        try {
            await actualizarEstadoPedido(id, estado);
            await cargarPedidos();
        } catch (error) {
            setError(error.message);
        }
    }

    if (cargando) {
        return <p>Cargando pedidos...</p>;
    }

    return (
        <main className="admin-pedidos">

            {/* Encabezado de administración */}
            <div className="admin-pedidos-header">
                <h1>Administración de pedidos</h1>

                <Link to="/" className="btn-volver">
                    Volver a la página principal
                </Link>
            </div>

            {error && <p role="alert">{error}</p>}

            {pedidos.length === 0 ? (
                <p>No hay pedidos registrados.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Actualizar</th>
                        </tr>
                    </thead>

                    <tbody>
                        {pedidos.map((pedido) => (
                            <tr key={pedido.id}>
                                <td>#{pedido.id}</td>
                                <td>
                                    {pedido.usuario?.nombre || "Cliente"}
                                </td>
                                <td>
                                    {pedido.fechaCreacion
                                        ? new Date(pedido.fechaCreacion).toLocaleDateString("es-CO")
                                        : "No disponible"}
                                </td>
                                <td>
                                    {Number(pedido.total).toLocaleString("es-CO", {
                                        style: "currency",
                                        currency: "COP"
                                    })}
                                </td>
                                <td>{pedido.estado}</td>
                                <td>
                                    <select
                                        value={pedido.estado}
                                        onChange={(evento) =>
                                            cambiarEstado(
                                                pedido.id,
                                                evento.target.value
                                            )
                                        }
                                    >
                                        <option value="PENDIENTE">Pendiente</option>
                                        <option value="EN_PREPARACION">En preparación</option>
                                        <option value="ENVIADO">Enviado</option>
                                        <option value="ENTREGADO">Entregado</option>
                                        <option value="CANCELADO">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </main>
    );
}

export default AdminPedidos;
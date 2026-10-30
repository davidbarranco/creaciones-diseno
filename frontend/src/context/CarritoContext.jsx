import { createContext, useContext, useEffect, useState } from "react";

const CarritoContext = createContext(null);

export function CarritoProvider({ children }) {


    const [carrito, setCarrito] = useState(function () {
        const carritoGuardado = localStorage.getItem("carrito");

        return carritoGuardado ? JSON.parse(carritoGuardado) : [];
    });

    // Mantiene el carrito guardado en el navegador
    useEffect(function () {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    // Agrega un producto o aumenta su cantidad
    function agregarProducto(producto) {
        setCarrito(function (carritoActual) {

            const productoExistente = carritoActual.find(function (item) {
                return item.id === producto.id;
            });

            if (productoExistente) {
                return carritoActual.map(function (item) {
                    if (item.id === producto.id) {
                        return {
                            ...item,
                            cantidad: item.cantidad + 1
                        };
                    }

                    return item;
                });
            }

            return [
                ...carritoActual,
                {
                    ...producto,
                    cantidad: 1
                }
            ];
        });
    }

    // Aumenta la cantidad de un producto
    function aumentarCantidad(id) {
        setCarrito(function (carritoActual) {
            return carritoActual.map(function (item) {
                if (item.id === id) {
                    return {
                        ...item,
                        cantidad: item.cantidad + 1
                    };
                }

                return item;
            });
        });
    }

    // Disminuye la cantidad y elimina el producto si llega a cero
    function disminuirCantidad(id) {
        setCarrito(function (carritoActual) {
            return carritoActual
                .map(function (item) {
                    if (item.id === id) {
                        return {
                            ...item,
                            cantidad: item.cantidad - 1
                        };
                    }

                    return item;
                })
                .filter(function (item) {
                    return item.cantidad > 0;
                });
        });
    }

    // Elimina un producto del carrito
    function eliminarProducto(id) {
        setCarrito(function (carritoActual) {
            return carritoActual.filter(function (item) {
                return item.id !== id;
            });
        });
    }

    // Vacía completamente el carrito
    function vaciarCarrito() {
        setCarrito([]);
    }

    // Calcula la cantidad total de unidades
    const cantidadProductos = carrito.reduce(function (total, item) {
        return total + item.cantidad;
    }, 0);

    // Calcula el valor total del carrito
    const totalCarrito = carrito.reduce(function (total, item) {
        return total + item.precio * item.cantidad;
    }, 0);

    const valor = {
        carrito,
        cantidadProductos,
        totalCarrito,
        agregarProducto,
        aumentarCantidad,
        disminuirCantidad,
        eliminarProducto,
        vaciarCarrito
    };

    return (
        <CarritoContext.Provider value={valor}>
            {children}
        </CarritoContext.Provider>
    );


}

export function useCarrito() {
    return useContext(CarritoContext);
}

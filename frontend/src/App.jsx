import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { useCarrito } from "./context/CarritoContext";
import "./App.css";

// Dirección base de la API.
const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

// Construye la dirección completa de las imágenes almacenadas en el backend.
function obtenerUrlImagen(imagen) {
  if (!imagen) return "";

  // Conserva las imágenes externas.
  if (imagen.startsWith("http://") || imagen.startsWith("https://")) {
    return imagen;
  }

  // Obtiene el origen del servidor backend.
  const origenServidor = new URL(API_URL).origin;

  // Limpia posibles espacios incorrectos en las rutas.
  const rutaLimpia = imagen.trim().replace(/\s*\/\s*/g, "/");

  // Construye la dirección completa de la imagen.
  return `${origenServidor}/${rutaLimpia.replace(/^\/+/, "")}`;
}

function App() {
  const { usuario, autenticado, logout } = useAuth();
  const { agregarProducto, cantidadProductos } = useCarrito();

  // Estados del catálogo.
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // Consulta los productos disponibles en la base de datos.
  useEffect(function () {
    async function cargarProductos() {
      try {
        const respuesta = await fetch(`${API_URL}/productos`);

        if (!respuesta.ok) {
          throw new Error("No fue posible cargar los productos.");
        }

        const datos = await respuesta.json();

        setProductos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    }

    cargarProductos();


  }, []);

  // Genera las categorías automáticamente según los productos registrados.
  const categorias = [
    "Todos",
    ...new Set(
      productos.map(function (producto) {
        return producto.categoria;
      })
    ),
  ];

  // Filtra los productos según la categoría seleccionada.
  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter(function (producto) {
        return producto.categoria === categoriaActiva;
      });

  // Convierte los precios al formato de pesos colombianos.
  function formatearPrecio(precio) {
    return Number(precio).toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  }

  return (<div className="pagina">
    {/* Encabezado */} <header className="encabezado"> <a href="#inicio" className="logo"> <span>Creaciones</span> <small>& DISEÑO</small> </a>

      ```
      <nav className="navegacion">
        <a href="#inicio">Inicio</a>
        <a href="#productos">Productos</a>
        <a href="#nosotros">Nosotros</a>
        <a href="#contacto">Contacto</a>
      </nav>

      <div className="acciones-usuario">
        {autenticado ? (
          <>
            <Link to="/mi-cuenta" className="boton-cuenta">
              Hola, {usuario.nombre}
            </Link>

            {/* Acceso exclusivo para administradores */}
            {usuario.rol === "ADMIN" && (
              <>
                <Link
                  to="/admin/pedidos"
                  className="boton-administracion"
                >
                  Administrar pedidos
                </Link>

                <Link
                  to="/admin/productos"
                  className="boton-administracion"
                >
                  Administrar productos
                </Link>
              </>
            )}

            <button
              className="boton-cerrar-sesion"
              onClick={logout}
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="boton-cuenta">
              Iniciar sesión
            </Link>

            <Link to="/registro" className="boton-registro">
              Registrarse
            </Link>
          </>
        )}

        <Link to="/carrito" className="boton-carrito">
          🛒 Carrito
          <span className="contador-carrito">
            {cantidadProductos}
          </span>
        </Link>
      </div>
    </header>

    <main>
      {/* Portada principal */}
      <section className="hero" id="inicio">
        <div className="hero-contenido">
          <span className="etiqueta">
            DISEÑOS HECHOS PARA TI
          </span>

          <h1>
            Diseñamos tus ideas,
            <span> creamos tus momentos.</span>
          </h1>

          <p>
            Productos personalizados con creatividad, dedicación
            y detalles que hacen especial cada momento.
          </p>

          <a href="#productos" className="boton-principal">
            Descubrir productos <span>→</span>
          </a>

          <div className="hero-detalle">
            <span>✦</span> Personalizamos tus ideas
          </div>
        </div>

        <div className="hero-imagen">
          <img
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200"
            alt="Productos y diseños personalizados"
          />

          <div className="hero-etiqueta">
            <span>CREATIVIDAD</span>
            <strong>En cada detalle.</strong>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="categorias">
        <div>
          <span className="texto-superior">
            EXPLORA NUESTRAS OPCIONES
          </span>

          <h2>Encuentra algo especial</h2>
        </div>

        <div className="categorias-lista">
          <a href="#productos">Camisetas</a>
          <a href="#productos">Mugs</a>
          <a href="#productos">Decoración</a>
          <a href="#productos">Diseños personalizados</a>
        </div>
      </section>

      {/* Productos */}
      <section className="productos" id="productos">
        <div className="seccion-titulo">
          <div>
            <span className="texto-superior">
              NUESTRA COLECCIÓN
            </span>

            <h2>Productos destacados</h2>

            <p>
              Pequeños detalles que transmiten grandes ideas.
            </p>
          </div>

          <span className="productos-contador">
            {productosFiltrados.length} productos
          </span>
        </div>

        {/* Filtros de categorías */}
        <div className="filtros">
          {categorias.map(function (categoria) {
            return (
              <button
                key={categoria}
                className={
                  categoriaActiva === categoria
                    ? "filtro activo"
                    : "filtro"
                }
                onClick={function () {
                  setCategoriaActiva(categoria);
                }}
              >
                {categoria}
              </button>
            );
          })}
        </div>

        {/* Estados de carga y errores */}
        {cargando && <p>Cargando productos...</p>}

        {error && <p>{error}</p>}

        {!cargando && !error && productosFiltrados.length === 0 && (
          <p>No hay productos disponibles en esta categoría.</p>
        )}

        {/* Tarjetas de productos */}
        {!cargando && !error && (
          <div className="productos-grid">
            {productosFiltrados.map(function (producto) {
              return (
                <article
                  className="producto-card"
                  key={producto.id}
                >
                  <div className="producto-imagen">
                    <img
                      src={
                        producto.imagen
                          ? obtenerUrlImagen(producto.imagen)
                          : "https://placehold.co/700x700?text=Producto"
                      }
                      alt={producto.nombre}
                      onError={function (evento) {
                        evento.target.src = "https://placehold.co/700x700?text=Producto";
                      }}
                    />

                    <span className="producto-etiqueta">
                      Personalizable
                    </span>
                  </div>

                  <div className="producto-info">
                    <span className="producto-categoria">
                      {producto.categoria}
                    </span>

                    <h3>{producto.nombre}</h3>

                    <div className="producto-pie">
                      <strong>
                        {formatearPrecio(producto.precio)}
                      </strong>

                      <button
                        className="boton-agregar-carrito"
                        onClick={function () {
                          agregarProducto(producto);
                        }}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Nosotros */}
      <section className="nosotros" id="nosotros">
        <div className="nosotros-imagen">
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000"
            alt="Proceso creativo y diseño"
          />
        </div>

        <div className="nosotros-contenido">
          <span className="texto-superior">
            SOBRE NOSOTROS
          </span>

          <h2>
            Las mejores ideas merecen convertirse en realidad.
          </h2>

          <p>
            En Creaciones & Diseño transformamos tus ideas en
            productos únicos. Trabajamos con creatividad y
            dedicación para ofrecerte detalles personalizados
            que cuentan historias.
          </p>

          <a href="#contacto" className="boton-principal">
            Conoce más <span>→</span>
          </a>
        </div>
      </section>

      {/* Contacto */}
      <section className="contacto" id="contacto">
        <span className="texto-superior">
          HAGAMOS ALGO ESPECIAL
        </span>

        <h2>¿Tienes una idea en mente?</h2>

        <p>
          Cuéntanos qué quieres personalizar y trabajemos juntos
          para hacerlo realidad.
        </p>

        <a
          href="mailto:contacto@creacionesydiseno.com"
          className="boton-principal"
        >
          Contáctanos <span>→</span>
        </a>
      </section>
    </main>

    {/* Pie de página */}
    <footer className="footer">
      <a href="#inicio" className="logo logo-footer">
        <span>Creaciones</span>
        <small>& DISEÑO</small>
      </a>

      <p>
        Diseñamos tus ideas, creamos tus momentos.
      </p>

      <span className="copyright">
        © {new Date().getFullYear()} Creaciones & Diseño.
        Todos los derechos reservados.
      </span>
    </footer>
  </div>


  );
}

export default App;

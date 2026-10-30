import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";
import { useCarrito } from "./context/CarritoContext";

const productos = [
  {
    id: 1,
    nombre: "Camiseta personalizada",
    categoria: "Camisetas",
    precio: 50000,
    imagen: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
  },
  {
    id: 2,
    nombre: "Mug personalizado",
    categoria: "Mugs",
    precio: 25000,
    imagen: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=700",
  },
  {
    id: 3,
    nombre: "Camiseta básica",
    categoria: "Camisetas",
    precio: 45000,
    imagen: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=700",
  },
  {
    id: 4,
    nombre: "Productos decorativos",
    categoria: "Decoración",
    precio: 35000,
    imagen: "https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?w=700",
  },
];

const categorias = ["Todos", "Camisetas", "Mugs", "Decoración"];

function App() {
  const { usuario, autenticado, logout } = useAuth();
  const { agregarProducto, cantidadProductos } = useCarrito();

  // Controla la categoría seleccionada en los filtros
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  // Filtra los productos según la categoría seleccionada
  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter(function (producto) {
        return producto.categoria === categoriaActiva;
      });

  function formatearPrecio(precio) {
    return precio.toLocaleString("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    });
  }

  return (
    <div className="pagina">

      {/* Encabezado */}
      <header className="encabezado">

        <a href="#inicio" className="logo">
          <span>Creaciones</span>
          <small>& DISEÑO</small>
        </a>

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

          {/* Tarjetas de productos */}
          <div className="productos-grid">

            {productosFiltrados.map(function (producto) {
              return (
                <article
                  className="producto-card"
                  key={producto.id}
                >

                  <div className="producto-imagen">

                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
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
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import "./App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        setCargando(true);
        setError("");

        const respuesta = await fetch("http://localhost:3000/api/productos");

        if (!respuesta.ok) {
          throw new Error("No se pudieron obtener los productos.");
        }

        const datos = await respuesta.json();
        setProductos(datos);
      } catch (error) {
        setError(error.message);
      } finally {
        setCargando(false);
      }
    };

    obtenerProductos();
  }, []);

  const productosFiltrados = productos.filter((producto) => {
    const textoBusqueda = busqueda.toLowerCase();

    return (
      producto.nombre.toLowerCase().includes(textoBusqueda) ||
      producto.descripcion.toLowerCase().includes(textoBusqueda) ||
      producto.materiales.toLowerCase().includes(textoBusqueda)
    );
  });

  const agregarAlCarrito = (producto) => {
    setCarrito((carritoActual) => [...carritoActual, producto]);
  };

  const seleccionarProducto = (producto) => {
    setProductoSeleccionado(producto);
  };

  const cerrarDetalle = () => {
    setProductoSeleccionado(null);
  };

  const manejarBusqueda = (e) => {
    setBusqueda(e.target.value);
  };

  const manejarContacto = (datosFormulario) => {
    console.log("Formulario enviado:", datosFormulario);
  };

  return (
    <>
      <Navbar carritoCantidad={carrito.length} />

      <main>
        {cargando && <p>Cargando productos...</p>}

        {error && <p>{error}</p>}

        {!cargando && !error && !productoSeleccionado && (
          <ProductList
            productos={productosFiltrados}
            onSelect={seleccionarProducto}
            busqueda={busqueda}
            onBuscar={manejarBusqueda}
          />
        )}

        {!cargando && !error && productoSeleccionado && (
          <ProductDetail
            producto={productoSeleccionado}
            onClose={cerrarDetalle}
            onAddToCart={agregarAlCarrito}
          />
        )}

        <ContactForm onSubmit={manejarContacto} />
      </main>

      <Footer />
    </>
  );
}

export default App;
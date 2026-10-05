import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import ProductList from "./ProductList";
import ProductDetail from "./ProductDetail";
import ContactForm from "./ContactForm";
import Footer from "./Footer";
import CartModal from "./CartModal";
import "./App.css";

const API_URL = "http://localhost:3000";

function getPath() {
    return window.location.pathname.replace(/\/$/, "") || "/";
}

function normalizarCarrito(carritoGuardado) {
    if (!Array.isArray(carritoGuardado)) {
        return [];
    }

    return carritoGuardado.reduce((carrito, producto) => {
        const imagen = producto.imagen
            ?.replace(/^\.\.\//, "/")
            .replace(/^assets\//, "/assets/");
        const indice = carrito.findIndex((item) => item.id === producto.id);

        if (indice >= 0) {
            carrito[indice].cantidad += producto.cantidad || 1;
        } else {
            carrito.push({
                ...producto,
                imagen,
                cantidad: producto.cantidad || 1,
            });
        }

        return carrito;
    }, []);
}

function App() {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState("");
    const [ruta, setRuta] = useState(getPath);
    const [carrito, setCarrito] = useState(() => {
        try {
            return normalizarCarrito(
                JSON.parse(localStorage.getItem("carrito") || "[]"),
            );
        } catch {
            return [];
        }
    });
    const [busqueda, setBusqueda] = useState("");
    const [carritoAbierto, setCarritoAbierto] = useState(false);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                setCargando(true);
                setError("");

                const respuesta = await fetch(`${API_URL}/api/productos`);

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

    useEffect(() => {
        const cambiarRuta = () => setRuta(getPath());
        window.addEventListener("popstate", cambiarRuta);

        return () => window.removeEventListener("popstate", cambiarRuta);
    }, []);

    useEffect(() => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }, [carrito]);

    const navegar = (destino) => {
        window.history.pushState({}, "", destino);
        setRuta(getPath());
        setBusqueda("");

        const hash = destino.split("#")[1];
        if (hash) {
            window.requestAnimationFrame(() => {
                document
                    .getElementById(hash)
                    ?.scrollIntoView({ behavior: "smooth" });
            });
        }
    };

    const agregarAlCarrito = (producto) => {
        setCarrito((carritoActual) => {
            const productoExistente = carritoActual.find(
                (item) => item.id === producto.id,
            );

            if (productoExistente) {
                return carritoActual.map((item) =>
                    item.id === producto.id
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item,
                );
            }

            return [...carritoActual, { ...producto, cantidad: 1 }];
        });
    };

    const manejarBusqueda = (e) => {
        setBusqueda(e.target.value);
    };

    const manejarContacto = (datosFormulario) => {
        console.log("Formulario enviado:", datosFormulario);
    };

    const actualizarCantidad = (id, cantidad) => {
        if (cantidad <= 0) {
            setCarrito((carritoActual) =>
                carritoActual.filter((item) => item.id !== id),
            );
            return;
        }

        setCarrito((carritoActual) =>
            carritoActual.map((item) =>
                item.id === id ? { ...item, cantidad } : item,
            ),
        );
    };

    const vaciarCarrito = () => setCarrito([]);

    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0,
    );
    const productoId = ruta.startsWith("/producto/")
        ? Number(ruta.split("/")[2])
        : null;
    const productoSeleccionado = productos.find(
        (producto) => producto.id === productoId,
    );
    const productosFiltrados = productos.filter((producto) => {
        const textoBusqueda = busqueda.toLowerCase();

        return (
            producto.nombre.toLowerCase().includes(textoBusqueda) ||
            producto.descripcion.toLowerCase().includes(textoBusqueda) ||
            producto.materiales.toLowerCase().includes(textoBusqueda)
        );
    });

    let contenido;

    if (cargando) {
        contenido = <p className="estado-pagina">Cargando catálogo...</p>;
    } else if (error) {
        contenido = <p className="estado-pagina error-pagina">{error}</p>;
    } else if (ruta === "/productos") {
        contenido = (
            <ProductList
                productos={productosFiltrados}
                onSelect={(producto) => navegar(`/producto/${producto.id}`)}
                busqueda={busqueda}
                onBuscar={manejarBusqueda}
            />
        );
    } else if (ruta.startsWith("/producto/")) {
        contenido = productoSeleccionado ? (
            <ProductDetail
                producto={productoSeleccionado}
                onClose={() => navegar("/productos")}
                onAddToCart={agregarAlCarrito}
            />
        ) : (
            <section className="estado-pagina">
                <p className="eyebrow">Catálogo</p>
                <h1>Producto no encontrado</h1>
                <button
                    className="btn-detalle"
                    onClick={() => navegar("/productos")}
                >
                    Volver al catálogo
                </button>
            </section>
        );
    } else if (ruta === "/contacto") {
        contenido = <ContactForm onSubmit={manejarContacto} />;
    } else {
        contenido = (
            <>
                <section className="hero-banner">
                    <p className="eyebrow">Tradición artesanal</p>
                    <h1>Mueblería Hermanos Jota</h1>
                    <p>
                        Desde hace más de <strong>30 años</strong>, fabricamos
                        muebles con dedicación, materiales seleccionados y
                        oficio artesanal.
                    </p>
                    <button
                        className="btn-hero"
                        onClick={() => navegar("/productos")}
                    >
                        Explorar catálogo
                    </button>
                </section>
                <section className="nosotros" id="nosotros">
                    <div className="nosotros-contenido">
                        <p className="eyebrow">Nuestra historia</p>
                        <h2>Más de 30 años creando muebles</h2>
                        <p>
                            Combinamos tradición artesanal, materiales
                            seleccionados y diseño contemporáneo para crear
                            piezas pensadas para acompañarte durante muchos
                            años.
                        </p>
                    </div>
                </section>
            </>
        );
    }

    return (
        <>
            <Navbar
                carritoCantidad={cantidadTotal}
                onNavigate={navegar}
                onOpenCart={() => setCarritoAbierto(true)}
            />

            <main>{contenido}</main>

            <CartModal
                abierto={carritoAbierto}
                carrito={carrito}
                onClose={() => setCarritoAbierto(false)}
                onUpdateQuantity={actualizarCantidad}
                onRemove={(id) => actualizarCantidad(id, 0)}
                onClear={vaciarCarrito}
            />

            <Footer />
        </>
    );
}

export default App;

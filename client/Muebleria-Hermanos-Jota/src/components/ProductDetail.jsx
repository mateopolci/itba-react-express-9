//productdetail//

import "../styles/App.css";

const API_URL = "http://localhost:3000";

function ProductDetail({ producto, onClose, onAddToCart }) {
    if (!producto) {
        return null;
    }

    return (
        <section className="product-detail">
            <button className="btn-volver" onClick={onClose}>
                ← Volver
            </button>

            <div className="detalle-contenido">
                <img
                    src={`${API_URL}${producto.imagen}`}
                    alt={producto.nombre}
                />

                <div className="detalle-info">
                    <p className="eyebrow">Colección Hermanos Jota</p>

                    <h1>{producto.nombre}</h1>

                    <p>{producto.descripcion}</p>

                    <p>
                        <strong>Materiales:</strong> {producto.materiales}
                    </p>

                    <button
                        className="btn-detalle"
                        onClick={() => onAddToCart(producto)}
                    >
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ProductDetail;

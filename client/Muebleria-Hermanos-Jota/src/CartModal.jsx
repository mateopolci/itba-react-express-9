import { useState } from "react";
import "./CartModal.css";

const API_URL = "http://localhost:3000";

function CartModal({
    abierto,
    carrito,
    onClose,
    onUpdateQuantity,
    onRemove,
    onClear,
}) {
    const [modo, setModo] = useState("carrito");
    const [enviado, setEnviado] = useState(false);
    const [datos, setDatos] = useState({ nombre: "", email: "" });

    if (!abierto) {
        return null;
    }

    const cantidadTotal = carrito.reduce(
        (total, producto) => total + producto.cantidad,
        0,
    );

    const cambiarModo = (nuevoModo) => {
        setEnviado(false);
        setModo(nuevoModo);
    };

    const cambiarDato = (event) => {
        setDatos({ ...datos, [event.target.name]: event.target.value });
    };

    const confirmarCheckout = (event) => {
        event.preventDefault();
        onClear();
        setEnviado(true);
    };

    return (
        <div
            className="carrito-panel"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <section
                className="carrito-contenido"
                role="dialog"
                aria-modal="true"
                aria-labelledby="titulo-carrito"
            >
                <div className="carrito-header">
                    <div>
                        <p className="eyebrow">Hermanos Jota</p>
                        <h2 id="titulo-carrito">
                            {modo === "carrito" ? "Tu carrito" : "Checkout"}
                        </h2>
                    </div>
                    <button
                        type="button"
                        className="boton-cerrar"
                        onClick={onClose}
                        aria-label="Cerrar carrito"
                    >
                        x
                    </button>
                </div>

                {enviado ? (
                    <div className="checkout-exito">
                        <p className="eyebrow">Pedido recibido</p>
                        <h3>Gracias, {datos.nombre}.</h3>
                        <p>
                            Te contactaremos a {datos.email} para coordinar la
                            compra.
                        </p>
                        <button
                            type="button"
                            className="btn-detalle"
                            onClick={onClose}
                        >
                            Cerrar
                        </button>
                    </div>
                ) : modo === "carrito" ? (
                    <>
                        {carrito.length === 0 ? (
                            <p className="carrito-vacio">
                                Tu carrito está vacío.
                            </p>
                        ) : (
                            <div className="carrito-items">
                                {carrito.map((producto) => (
                                    <article
                                        className="carrito-item"
                                        key={producto.id}
                                    >
                                        <img
                                            src={`${API_URL}${producto.imagen}`}
                                            alt={producto.nombre}
                                        />
                                        <div className="carrito-item-info">
                                            <h3>{producto.nombre}</h3>
                                            <p>{producto.materiales}</p>
                                            <div
                                                className="cantidad-control"
                                                aria-label={`Cantidad de ${producto.nombre}`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            producto.id,
                                                            producto.cantidad -
                                                                1,
                                                        )
                                                    }
                                                    aria-label="Disminuir cantidad"
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={producto.cantidad}
                                                    onChange={(event) =>
                                                        onUpdateQuantity(
                                                            producto.id,
                                                            Math.max(
                                                                1,
                                                                Number(
                                                                    event.target
                                                                        .value,
                                                                ) || 1,
                                                            ),
                                                        )
                                                    }
                                                    aria-label="Cantidad"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        onUpdateQuantity(
                                                            producto.id,
                                                            producto.cantidad +
                                                                1,
                                                        )
                                                    }
                                                    aria-label="Aumentar cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="quitar-producto"
                                                onClick={() =>
                                                    onRemove(producto.id)
                                                }
                                            >
                                                Quitar producto
                                            </button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}

                        <div className="carrito-footer">
                            <strong>
                                {cantidadTotal} producto
                                {cantidadTotal === 1 ? "" : "s"}
                            </strong>
                            <button
                                type="button"
                                className="boton-secundario"
                                onClick={onClear}
                                disabled={carrito.length === 0}
                            >
                                Vaciar carrito
                            </button>
                            <button
                                type="button"
                                className="btn-detalle"
                                onClick={() => cambiarModo("checkout")}
                                disabled={carrito.length === 0}
                            >
                                Continuar al checkout
                            </button>
                        </div>
                    </>
                ) : (
                    <form
                        className="checkout-form"
                        onSubmit={confirmarCheckout}
                    >
                        <p>
                            Completá tus datos para confirmar la compra de tus
                            muebles.
                        </p>
                        <label>
                            Nombre
                            <input
                                name="nombre"
                                value={datos.nombre}
                                onChange={cambiarDato}
                                required
                                minLength="2"
                            />
                        </label>
                        <label>
                            Email
                            <input
                                type="email"
                                name="email"
                                value={datos.email}
                                onChange={cambiarDato}
                                required
                            />
                        </label>
                        <div className="checkout-actions">
                            <button
                                type="button"
                                className="boton-secundario"
                                onClick={() => cambiarModo("carrito")}
                            >
                                Volver al carrito
                            </button>
                            <button type="submit" className="btn-detalle">
                                Confirmar compra
                            </button>
                        </div>
                    </form>
                )}
            </section>
        </div>
    );
}

export default CartModal;

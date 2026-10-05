//navbar//
import "./Navbar.css";

function Navbar({
    titulo = "Hermanos Jota",
    carritoCantidad = 0,
    onNavigate,
    onOpenCart,
}) {
    const navegar = (event, destino) => {
        event.preventDefault();
        onNavigate(destino);
    };

    return (
        <header className="navbar">
            <div className="navbar-logo">
                <span className="navbar-mark" aria-hidden="true">
                    HJ
                </span>

                <span>{titulo}</span>
            </div>

            <nav>
                <ul className="navbar-menu">
                    <li>
                        <a href="/" onClick={(event) => navegar(event, "/")}>
                            Inicio
                        </a>
                    </li>

                    <li>
                        <a
                            href="/productos"
                            onClick={(event) => navegar(event, "/productos")}
                        >
                            Productos
                        </a>
                    </li>

                    <li>
                        <a
                            href="/#nosotros"
                            onClick={(event) => navegar(event, "/#nosotros")}
                        >
                            Nosotros
                        </a>
                    </li>

                    <li>
                        <a
                            href="/contacto"
                            onClick={(event) => navegar(event, "/contacto")}
                        >
                            Contacto
                        </a>
                    </li>
                </ul>
            </nav>

            <button className="navbar-carrito" onClick={onOpenCart}>
                🛒 Carrito
                <span className="contador">{carritoCantidad}</span>
            </button>
        </header>
    );
}

export default Navbar;

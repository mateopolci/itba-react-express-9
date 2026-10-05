//navbar//
import "./Navbar.css";

function Navbar({ titulo = "Hermanos Jota", carritoCantidad = 0 }) {
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
                        <a href="/">Inicio</a>
                    </li>

                    <li>
                        <a href="/productos">Productos</a>
                    </li>

                    <li>
                        <a href="/">Nosotros</a>
                    </li>

                    <li>
                        <a href="/">Contacto</a>
                    </li>
                </ul>
            </nav>

            <button className="navbar-carrito">
                🛒 Carrito
                <span className="contador">{carritoCantidad}</span>
            </button>
        </header>
    );
}

export default Navbar;

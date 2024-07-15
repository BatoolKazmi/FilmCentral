import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";

function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/" >Home</NavLink>
            <NavLink to="/towatchlist">My WatchList</NavLink>
            <NavLink to="/completedwatchlist">Completed WatchList</NavLink>
        </nav>
    );
};

export default NavBar;

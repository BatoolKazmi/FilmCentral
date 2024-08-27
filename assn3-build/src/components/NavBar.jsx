import { NavLink } from "react-router-dom";
import "../styles/NavBar.css";
import Logout from "./LoginSignup/Logout";

function NavBar() {
    return (
        <nav className="navbar">
            <NavLink to="/" >Home</NavLink>
            <NavLink to="/towatchlist">My WatchList</NavLink>
            <NavLink to="/completedwatchlist">Completed WatchList</NavLink>
            <NavLink to="/user">User</NavLink>
            <Logout />
        </nav>
    );
};

export default NavBar;

import Home from "./Home";
import ErrorPage from "./Error";
import ToWatchList from "./ToWatchList";
import CompletedWatchList from "./CompletedWatchList";
import CompletedMovies from "./CompletedMovies";
import Movie from "./Movie";
import ToWatchListMovies from "./TowatchlistMovies";
import Login from "../LoginSignup/Login";
import Signup from "../LoginSignup/Signup";
import User from "./User";
import ProtectedRoute from "./ProtectedRoute";
import Logout from "../LoginSignup/Logout";

const routes = [
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />, // Global error handling for this route
  },
  {
    path: "/towatchlist",
    element: (
      <ProtectedRoute>
        <ToWatchList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/completedwatchlist",
    element: (
      <ProtectedRoute>
        <CompletedWatchList />
      </ProtectedRoute>
    ),
  },
  {
    path: "/movies/:id", // Route with dynamic parameter
    element: (
      <ProtectedRoute>
        <Movie />
      </ProtectedRoute>
    ),
  },
  {
    path: "/completedwatchlist/entries/:id/:key", // Nested dynamic parameter
    element: (
      <ProtectedRoute>
        <CompletedMovies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/towatchlist/entries/:id/:key",
    element: (
      <ProtectedRoute>
        <ToWatchListMovies />
      </ProtectedRoute>
    ),
  },
  {
    path: "/login",
    element: <Login />, // No protection, public route
  },
  {
    path: "/signup",
    element: <Signup />, // No protection, public route
  },
  {
    path: "/user",
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: "/logout",
    element: <Logout />, // Handle session cleanup and redirection
  },
];

export default routes;

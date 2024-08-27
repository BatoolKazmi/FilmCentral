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
    element: <ProtectedRoute><Home /></ProtectedRoute>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/towatchlist",
    element: <ProtectedRoute><ToWatchList /></ProtectedRoute>,
  },
  {
    path: "/completedwatchlist",
    element: <ProtectedRoute><CompletedWatchList /></ProtectedRoute>,
  },
  {
    path: "/movies/:id",
    element: <ProtectedRoute><Movie /></ProtectedRoute>,
  },
  {
    path: "/completedwatchlist/entries/:id/:key",
    element: <ProtectedRoute><CompletedMovies /></ProtectedRoute>,
  },
  {
    path: "/towatchlist/entries/:id/:key",
    element: <ProtectedRoute><ToWatchListMovies /></ProtectedRoute>,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  },
  {
    path: "/user",
    element: <ProtectedRoute><User/></ProtectedRoute>
  },
  {
    path: "/logout",
    element: <Logout/>
  }
];

export default routes;

import Home from "./Home";
import ErrorPage from "./Error";
import ToWatchList from "./ToWatchList";
import CompletedWatchList from "./CompletedWatchList";
import CompletedMovies from "./CompletedMovies";
import Movie from "./Movie";
import ToWatchListMovies from "./TowatchlistMovies";
import Login from "../LoginSignup/Login";
import Signup from "../LoginSignup/Signup";

const routes = [
  {
    path: "/",
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/towatchlist",
    element: <ToWatchList />,
  },
  {
    path: "/completedwatchlist",
    element: <CompletedWatchList />,
  },
  {
    path: "/movies/:id",
    element: <Movie />,
  },
  {
    path: "/completedwatchlist/entries/:id/:key",
    element: <CompletedMovies />,
  },
  {
    path: "/towatchlist/entries/:id/:key",
    element: <ToWatchListMovies />,
  },
  {
    path: "/login",
    element: <Login/>
  },
  {
    path: "/signup",
    element: <Signup/>
  }
];

export default routes;

import Home from "./Home";
import ErrorPage from "./Error";
import ToWatchList from "./ToWatchList";
import CompletedWatchList from "./CompletedWatchList";
import CompletedMovies from "./CompletedMovies";
import Movie from "./Movie";
import ToWatchListMovies from "./TowatchlistMovies";

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
];

export default routes;

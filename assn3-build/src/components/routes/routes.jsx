import Home from "./Home";
import ErrorPage from "./Error";
import ToWatchList from "./ToWatchList";
import CompletedWatchList from "./CompletedWatchList";
import Movie from "./Movie";

const routes = [
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />
    },
    {
        path: "/towatchlist",
        element: <ToWatchList />
    },
    {
        path: "/completedwatchlist",
        element: <CompletedWatchList />
    },
    {
        path: "/movies",
        element: <Movie />
    }
];

export default routes;

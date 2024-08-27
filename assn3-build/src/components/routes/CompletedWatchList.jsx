import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCardCompleted from "../MovieCardCompleted";
import FindMovie from "../FindMovie";
import Pagination from "../Pagination";
import Logout from "../LoginSignup/Logout";
import axios from "axios";

function CompletedWatchList() {
  const [movies, setMovies] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    fetchMovies();
    fetchApiKey();
  }, [movies]);

  async function fetchMovies() {
    try {
      const response = await axios.get('http://localhost:5000/api/completedwatchlist/entries', { withCredentials: true });
      if (Array.isArray(response.data)) {
        setMovies(response.data);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  }

  async function fetchApiKey() {
    try {
      const response = await axios.get('http://localhost:5000/api/getApiKey', { withCredentials: true });
      setKey(response.data.apiKey);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    }
  }

  function handleMovieRemoval(id) {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.completedId !== id));
  }

  // Adding pagination
  ///
  const [currentPage, setCurrentPage] = useState(1);
  // Do like 20, 30, 40 or 50
  const [moviesPerPage, setmoviesPerPage] = useState(30);

  const lastPostIndex = currentPage * moviesPerPage;
  const firstPostIndex = lastPostIndex - moviesPerPage;

  const currentPosts = movies.slice(firstPostIndex, lastPostIndex);


  return (
    <>
      <header>
        <NavBar />
        <h1>Completed Watch List</h1>
        {/* <FindMovie onKeySubmit={getMovies} /> */}
      </header>
      <div>
                <Pagination
                    currentPage={currentPage}
                    total={movies.length}
                    limit={30}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
      <main>
        {/* Info goes here! */}
        {movies.map((movie, i) => (
          <MovieCardCompleted
            movie={movie}
            key={i}
            completedId={movie.completedId}
            id={movie.movieid}
            // Batool
            //completedId={movie.completedWatchListId}
            apiKey={key}
            onRemove={handleMovieRemoval}
          />
        ))}
      </main>
      <div>
                <Pagination
                    currentPage={currentPage}
                    total={movies.length}
                    limit={30}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
    </>
  );
}

export default CompletedWatchList;

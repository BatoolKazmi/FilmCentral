import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FindMovie from "../FindMovie";
import MovieCardTowatch from "../MovieCardToWatch";
import Pagination from "../Pagination";

function ToWatchList() {
  const [movies, setMovies] = useState([]);
  const [key, setKey] = useState("");

  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries?key=${key}`;
  const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/towatchlist/entries?key=${key}`

  console.log(key);
  async function fetchMovie() {
    try {
      const resp = await fetch(API);
      if (!resp.ok) {
        throw new Error(`HTTP error! status: ${resp.status}`);
      }
      const jsonResponse = await resp.json();
      console.log("API Response:", jsonResponse);
      if (Array.isArray(jsonResponse)) {
        setMovies(jsonResponse);
      } else {
        console.error("API response is not an array:", jsonResponse);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  }

  useEffect(() => {
    fetchMovie();
  }, [key]);
  function getMovies(key) {
    setKey(key);
  }
  function handleMovieRemoval() {
    fetchMovie(); // Refresh the movie list
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
        <h1>To Watch List</h1>
        <FindMovie onKeySubmit={getMovies} />
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
          <MovieCardTowatch
            movie={movie}
            key={i}
            id={movie.movieid}
            // Shelmah
            // Watchlistid={movie.Watchlistid}
            Watchlistid={movie.watchListId}
            onRemove={handleMovieRemoval}
            apiKey={key}
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

export default ToWatchList;

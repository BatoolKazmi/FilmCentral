import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FindMovie from "../FindMovie";
import MovieCardTowatch from "../MovieCardToWatch";

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
  return (
    <>
      <header>
        <NavBar />
        <h1>To Watch List</h1>
        <FindMovie onKeySubmit={getMovies} />
      </header>
      <main>
        {/* Info goes here! */}
        {movies.map((movie) => (
          <MovieCardTowatch
            movie={movie}
            id={movie.movieid}
            // Watchlistid={movie.Watchlistid}

            // Batool
            Watchlistid={movie.watchListId}
            apiKey={key}
          />
        ))}
      </main>
    </>
  );
}

export default ToWatchList;

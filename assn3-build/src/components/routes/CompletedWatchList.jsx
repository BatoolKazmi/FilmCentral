import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FindMovie from "../FindMovie";

function CompletedWatchList() {
  const [movies, setMovies] = useState([]);
  const [key, setKey] = useState("");

  const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries?key=${key}`;

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
        <h1>Completed Watch List</h1>
        <FindMovie onKeySubmit={getMovies} />
      </header>
      <main>
        {/* Info goes here! */}
        {movies.map((movie) => (
          <MovieCard movie={movie} id={movie.movieid} />
        ))}
      </main>
    </>
  );
}

export default CompletedWatchList;

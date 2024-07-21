import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function CompletedMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);

  if (movie.poster == "NA") {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}?key=${key}`;

  async function fetchContact() {
    const resp = await fetch(API);
    const jsonResponse = await resp.json();
    const set = jsonResponse;
    setMovie(set);
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, []);

  // IDK HOW TO EXTRACT GENRES NAMES
  // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES

  return (
    <>
      <NavBar />
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} />
      <p>
        <strong>Rating:</strong> {movie.rating}
      </p>
      <p>
        <strong>Notes:</strong> {movie.notes}
      </p>
      <p>
        <strong>First watched on:</strong> {movie.date_initially_watched}
      </p>
      <p>
        <strong>Last watched on:</strong> {movie.date_last_watched}
      </p>
      <p>
        <strong>Times Watched:</strong> {movie.times_watched}
      </p>
      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default CompletedMovies;

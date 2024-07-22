import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function CompletedMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [timesWatched, setTimesWatched] = useState(0);

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
    setTimesWatched(jsonResponse.times_watched || 0);
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key]);

  // IDK HOW TO EXTRACT GENRES NAMES
  // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES
  async function updateTimesWatched() {
    const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}/times-watched`;
    const response = await fetch(updateAPI, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": key, // API key header
      },
      body: JSON.stringify({}),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      setTimesWatched(jsonResponse.times_watched);
    } else {
      console.error("Failed to update times watched");
    }
  }
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
        <strong>Times Watched:</strong> {timesWatched}
      </p>
      <button onClick={updateTimesWatched}>Increase Times Watched</button>
      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default CompletedMovies;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function CompletedMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [timesWatched, setTimesWatched] = useState(0);
  const [rating, setRating] = useState("");

  if (movie.poster == "NA") {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}?key=${key}`;
  const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/completedwatchlist/entries/${id}?key=${key}`;

  async function fetchContact() {
    const resp = await fetch(API);
    const jsonResponse = await resp.json();
    const set = jsonResponse;
    setMovie(set);
    setTimesWatched(jsonResponse.times_watched || 0);
    // setPriority(jsonResponse.priority || "Select");
  }

  // IDK HOW TO EXTRACT GENRES NAMES
  // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES
  async function updateTimesWatched() {
    // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}/times-watched`;
    const updateAPI = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/completedwatchlist/entries/${id}/times-watched`
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

  async function updateRating(newRating) {
    try {
      // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}/rating?key=${key}`;
      const updateAPI = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/completedwatchlist/entries/${id}/rating?key=${key}`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({key, rating: newRating }),
      });
      if (response.ok) {
        setRating(newRating);
      } else {
        const errorResponse = await response.text(); // Get the error response from the server
        console.error("Failed to update rating:", response.statusText, errorResponse);
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  }

  function handleRatingChange(event) {
    const newRating = event.target.value;
    setRating(newRating); // Update state immediately
    if (newRating !== "Select") {
      updateRating(newRating); // Only send update if not "Select"
    }
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key,rating]);


  return (
    <>
      <NavBar />
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} />
        <p><strong>Rating:</strong> {(!rating) ? movie.rating : rating}</p>
        <div>
        <label htmlFor="score">Update Rating (?/10):</label>
        <select
          name="score"
          id="score"
          value={rating}
          onChange={handleRatingChange}
        >
          <option value="Select">Select</option>
          <option value="1.0">1.0</option>
          <option value="2.0">2.0</option>
          <option value="3.0">3.0</option>
          <option value="4.0">4.0</option>
          <option value="5.0">5.0</option>
          <option value="6.0">6.0</option>
          <option value="7.0">7.0</option>
          <option value="8.0">8.0</option>
          <option value="9.0">9.0</option>
          <option value="10.0">10.0</option>
        </select>
      </div>
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

import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState } from "react";

function MovieCard({ movie, id }) {
  const alt = `${movie.title} poster`;
  //const [apiKey, setApiKey] = useState(""); // API key state
  const [isAdding, setIsAdding] = useState(false);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }
  async function handleQuickAdd(userApiKey) {
    setIsAdding(true); // Set state to indicate the process is ongoing
    const API =
      "https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries";

    const payload = {
      movie_id: id,
      priority: "5", // Default priority
      notes: "", // Default notes
      userApiKey,
    };

    console.log("Payload being sent:", payload); // Log payload
    console.log(userApiKey);

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": userApiKey, // API key header
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Movie added successfully:", jsonResponse);
    } else {
      console.error("Failed to add movie:", response.status);
    }

    setIsAdding(false); // Reset state after process
  }
  function promptForApiKey() {
    const userApiKey = prompt("Please enter your API key:");
    if (userApiKey) {
      //setApiKey(userApiKey);
      handleQuickAdd(userApiKey);
    }
  }
  return (
    <article>
      <img src={movie.poster} alt={alt} />
      <h2>{movie.title}</h2>
      {/* What should go here? */}
      <Link to={`/movies/${id}`}>Movie Details</Link>
      <div>
        <button onClick={promptForApiKey} disabled={isAdding}>
          {isAdding ? "Adding..." : "Quick Add to Watchlist"}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

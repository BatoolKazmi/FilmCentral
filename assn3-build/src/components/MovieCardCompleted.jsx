import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useEffect, useState } from "react";

function MovieCardCompleted({ movie, id, completedId, apiKey, onRemove }) {
  const alt = `${movie.title} poster`;
  const [isProcessing, setIsProcessing] = useState(false);


  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function handleRemove() {
    setIsProcessing(true);
    const removeFromCompletedListAPI = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/completedwatchlist/entries/${completedId}`;

    try {
      const removeResponse = await fetch(removeFromCompletedListAPI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({ movie_id: id }),
      });

      if (!removeResponse.ok) {
        throw new Error("Failed to remove movie from completed list");
      }

      console.log("Movie removed from completed list successfully");

      if (onRemove) onRemove(); // Trigger onRemove callback
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <article>
      <img src={movie.poster} alt={alt} />
      <h2>{movie.title}</h2>
      {/* What should go here? */}
      <div>
        <Link to={`/completedwatchlist/entries/${completedId}/${apiKey}`}>
          Rating Details
        </Link>
      </div>
      <div>
        <Link to={`/movies/${id}`}>Movie Details</Link>
      </div>
      <div>
        <button onClick={handleRemove} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Remove from Completed List"}
        </button>
      </div>
    </article>
  );
}

export default MovieCardCompleted;

import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState } from "react";

function MovieCardToWatch({ movie, id, apiKey, onRemove }) {
  const alt = `${movie.title} poster`;
  const [isProcessing, setIsProcessing] = useState(false);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function handleDelete() {
    setIsProcessing(true);
    const removeFromPlanningListAPI = `https://film-central-end.vercel.app/towatchlist/entries/${movie.watchListId}`;

    try {
      const removeResponse = await fetch(removeFromPlanningListAPI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({ movie_id: id }),
      });

      if (!removeResponse.ok) {
        throw new Error("Failed to remove movie from to-watch list");
      }

      console.log("Movie removed from to-watch list successfully");

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
      <h3>{movie.title}</h3>
      <div>
        <Link to={`/towatchlist/entries/${movie.watchListId}/${apiKey}`}>
          To Watch Details
        </Link>
      </div>
      <div>
        <Link to={`/movies/${id}`}>Movie Details</Link>
      </div>
      <div>
        <button onClick={handleDelete} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Remove from To Watch List"}
        </button>
      </div>
    </article>
  );
}

export default MovieCardToWatch;

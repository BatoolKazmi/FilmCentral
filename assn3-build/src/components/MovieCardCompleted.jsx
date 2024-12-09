import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useEffect, useState } from "react";
import axios from 'axios';

function MovieCardCompleted({ movie, id, completedId, apiKey, onRemove }) {
  const alt = `${movie.title} poster`;
  const [isProcessing, setIsProcessing] = useState(false);


  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function handleRemove() {
    setIsProcessing(true);
    const removeFromCompletedListAPI = `https://film-central-end.vercel.app/completedwatchlist/entries/${completedId}`;

    try {
      const removeResponse = await fetch(removeFromCompletedListAPI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ movie_id: id, key: apiKey }),
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

  async function handleRemoveAndAdd() {
    setIsProcessing(true);

    // Step 1: Remove from Completed Watch List
    const removeFromCompletedListAPI = `https://film-central-end.vercel.app/completedwatchlist/entries/${completedId}`;

    const json = JSON.stringify({ movie_id: id, key: apiKey})
    try {
      const removeResponse = await fetch(removeFromCompletedListAPI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      });

      if (!removeResponse.ok) {
        throw new Error("Failed to remove movie from completed list");
      }

      console.log("Movie removed from completed list successfully");

      // Step 2: Add to To Watch List
      const response = await axios.post('https://film-central-end.vercel.app/towatchlist/entries', {
        movieId: id,
        priority: "5",
        notes: "write a note!",
      }, { withCredentials: true });

      if (response.status === 201) {
        console.log("Movie added to To Watch List successfully:", response.data);
        alert("Added To Watch List!");
      } else {
        throw new Error(`Failed to add movie to To Watch List: ${response.status}`);
      }

      // Trigger onRemove callback if defined
      if (onRemove) onRemove();
      
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
      <div>
        <button onClick={handleRemoveAndAdd} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Move to To Watch List"}
        </button>
      </div>
    </article>
  );
}

export default MovieCardCompleted;

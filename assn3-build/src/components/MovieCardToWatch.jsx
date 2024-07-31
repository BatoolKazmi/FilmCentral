import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState } from "react";

function MovieCardTowatch({ movie, id, Watchlistid, apiKey }) {
  const alt = `${movie.title} poster`;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showRatingInput, setShowRatingInput] = useState(false);
  const [userRating, setUserRating] = useState("");

  if (movie.poster == "NA") {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }
  console.log(Watchlistid);
  async function handleMarkAsWatched() {
    setIsProcessing(true);
    const removeFromWatchlistAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${Watchlistid}`;
    const addToCompletedListAPI =
      "https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries";
    try {
      const removeResponse = await fetch(removeFromWatchlistAPI, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify({ movie_id: id }), // Send movie_id in the request body
      });

      if (!removeResponse.ok) {
        throw new Error("Failed to remove movie from watchlist");
      }
      function formatDate(inputDate) {
        const date = new Date(inputDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
      }
      const currentDate = new Date().toISOString();
      // Add to completed list
      const payload = {
        movie_id: id,
        rating: userRating, // User-provided rating
        notes: "Nice watch", // Default notes
        date_initially_watched: formatDate(currentDate), // Format date
        date_last_watched: formatDate(currentDate), // Format date
        times_watched: 1, // Default watch count
      };

      const addResponse = await fetch(addToCompletedListAPI, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!addResponse.ok) {
        throw new Error("Failed to add movie to completed list");
      }

      const jsonResponse = await addResponse.json();
      console.log("Movie marked as watched successfully:", jsonResponse);
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false); // Reset state after process
      setShowRatingInput(false); // Hide rating input after process
    }
  }
  //console.log(`${Watchlistid}`);
  function handleShowRatingInput() {
    setShowRatingInput(true);
  }
  return (
    <article>
      <img src={movie.poster} alt={alt} />
      <h2>{movie.title}</h2>
      {/* What should go here? */}
      <div>
        <Link to={`/towatchlist/entries/${Watchlistid}/${apiKey}`}>
          To Watch Details
        </Link>
      </div>
      <div>
        <Link to={`/movies/${id}`}>Movie Details</Link>
      </div>
      <div>
        <button onClick={handleShowRatingInput} disabled={isProcessing}>
          {isProcessing ? "Processing..." : "Mark as Watched"}
        </button>
        {showRatingInput && (
          <div>
            <input
              type="number"
              min="0"
              max="10"
              value={userRating}
              onChange={(e) => setUserRating(e.target.value)}
              placeholder="Rate this movie"
            />
            <button onClick={handleMarkAsWatched} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Submit Rating"}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default MovieCardTowatch;

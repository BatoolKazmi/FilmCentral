import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState } from "react";
import axios from 'axios';

function MovieCard({ movie, id }) {
  const alt = `${movie.title} poster`;
  //const [apiKey, setApiKey] = useState(""); // API key state
  const [isAdding, setIsAdding] = useState(false);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function handleQuickAdd() {
    setIsAdding(true); // Set state to indicate the process is ongoing

    try {
      const response = await axios.post('http://localhost:5000/api/towatchlist/entries', {
        movie_id: id,
        priority: "5",
        notes: "",
      }, { withCredentials: true });

      if (response.status === 200) {
        console.log("Movie added successfully:", response.data);
        alert("Added To Watch List!");
      } else {
        console.error("Failed to add movie:", response.status);
      }
    } catch (error) {
      console.error("Failed to add movie:", error);
    } finally {
      setIsAdding(false); // Reset state after process
    }

  }

  // function promptForApiKey() {
  //   const userApiKey = prompt("Please enter your API key:");
  //   if (userApiKey) {
  //     //setApiKey(userApiKey);
  //     handleQuickAdd(userApiKey);
  //   }
  // }

  return (
    <article>
      <img src={movie.poster} alt={alt} />
      <h2>{movie.title}</h2>
      {/* What should go here? */}
      <Link to={`/movies/${id}`}>Movie Details</Link>
      <div>
        {/* <button onClick={promptForApiKey} disabled={isAdding}> */}
        <button onClick={handleQuickAdd} disabled={isAdding}> 
          {isAdding ? "Adding..." : "Quick Add to Watchlist"}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

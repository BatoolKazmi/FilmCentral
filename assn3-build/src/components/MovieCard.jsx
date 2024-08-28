import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState, useEffect } from "react";
import axios from 'axios';

function MovieCard({ movie, id }) {
  const alt = `${movie.title} poster`;
  //const [apiKey, setApiKey] = useState(""); // API key state
  const [isAdding, setIsAdding] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  useEffect(() => {
    const checkIfMovieExists = async () => {
      try {
        const [watchlistResponse, completedListResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/towatchlist/entries', { params: { title: movie.title, movieid: id }, withCredentials: true }),
          axios.get('http://localhost:5000/api/completedwatchlist/entries', { params: { title: movie.title, movieid: id }, withCredentials: true })
        ]);

        if (watchlistResponse.data.length > 0 || completedListResponse.data.length > 0) {
          setIsInWatchlist(true);
        }
      } catch (error) {
        console.error('Error checking movie existence:', error);
      }
    };

    checkIfMovieExists();
  }, [movie.title]);

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
        setIsInWatchlist(true); // Update the state to disable the button
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
        <button onClick={handleQuickAdd} disabled={isAdding || isInWatchlist}> 
          {isAdding ? "Adding..." : (isInWatchlist ? "Already in a List" : "Quick Add to Watchlist")}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

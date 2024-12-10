import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState, useEffect } from "react";
import axios from 'axios';

function MovieCard({ movie, id }) {
  const alt = `${movie.title} poster`;
  const [isAdding, setIsAdding] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [isInCompleted, setIsInCompleted] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [checkingMovie, setCheckingMovie] = useState(true); // New loading state for checking movie existence

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  useEffect(() => {
    // Fetch API key from the server
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('https://film-central-end.vercel.app/api/getApiKey', { withCredentials: true });
        setApiKey(response.data.apiKey);
      } catch (error) {
        console.error('Failed to fetch API key:', error);
      }
    };
    fetchApiKey();
  }, []);

  useEffect(() => {
    const checkIfMovieExists = async () => {
      if (!apiKey) return;
  
      try {
        setCheckingMovie(true); // Start checking movie existence
        const response = await axios.get('https://film-central-end.vercel.app/watchlist/check', {
          params: { movieid: id },
          headers: { 'x-api-key': apiKey },
          withCredentials: true,
        });
  
        if (response.data && response.data.inList !== undefined) {
          const { inList } = response.data;
          if (inList === 'toWatchlist') {
            setIsInWatchlist(true);
          } else if (inList === 'completedWatchlist') {
            setIsInCompleted(true);
          } else {
            setIsInWatchlist(false);
            setIsInCompleted(false);
          }
        } else {
          console.error("Unexpected response format:", response.data);
        }
      } catch (error) {
        console.error("Error checking movie existence:", error);
      } finally {
        setCheckingMovie(false); // Finish checking movie existence
      }
    };
  
    checkIfMovieExists();
  }, [id, apiKey]);
  
  // Function to add the movie to the watch list
  async function addToWatchList() {
    setIsAdding(true);

    try {
      const priority = 5; // Replace with actual priority logic
      const notes = ''; // Replace with actual notes logic

      await axios.post(
        'https://film-central-end.vercel.app/towatchlist/entries',
        { movieId: id, priority, notes },
        { headers: { 'X-API-KEY': apiKey }, withCredentials: true }
      );

      // After adding to the watchlist, update state
      setIsInWatchlist(true);
    } catch (error) {
      console.error('Error adding movie to watch list:', error);
    } finally {
      setIsAdding(false);
    }
  }

  return (
    <article>
      <img src={movie.poster} alt={alt} />
      <h3>{movie.title}</h3>
      <Link to={`/movies/${id}`}>Movie Details</Link>
      <div>
        <button
          onClick={addToWatchList}
          disabled={isAdding || isInWatchlist || isInCompleted || checkingMovie} // Disable if movie is being checked
          className={isAdding || checkingMovie ? "Adding..." : (isInWatchlist || isInCompleted ? "disable" : "")}
        >
          {isAdding ? "Adding..." : checkingMovie ? "Checking..." : (isInWatchlist || isInCompleted ? "Already in a List" : "Quick Add to Watchlist")}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

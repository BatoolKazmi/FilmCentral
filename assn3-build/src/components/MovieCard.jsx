import { Link } from "react-router-dom";
import "../styles/MovieCard.css";
import { useState, useEffect } from "react";
import axios from 'axios';

function MovieCard({ movie, id }) {
  const alt = `${movie.title} poster`;
  //const [apiKey, setApiKey] = useState(""); // API key state
  const [isAdding, setIsAdding] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [apiKey, setApiKey] = useState("");

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  useEffect(() => {
    // Fetch API key from the server
    const fetchApiKey = async () => {
      try {
        const response = await axios.get('https://film-central-backend.vercel.app/api/getApiKey', { withCredentials: true });
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
        const [watchlistResponse, completedListResponse] = await Promise.all([
          axios.get('https://film-central-backend.vercel.app/towatchlist/check', {
            params: { movieid: id },
            headers: { 'x-api-key': apiKey },
            withCredentials: true
          }),
          axios.get('https://film-central-backend.vercel.app/completedwatchlist/check', {
            params: { movieid: id },
            headers: { 'x-api-key': apiKey },
            withCredentials: true
          })
        ]);


        if (watchlistResponse.data.length > 0 || completedListResponse.data.length > 0) {
          setIsInWatchlist(true);
        } else {
            setIsInWatchlist(false);  // Make sure to reset if not in any list
        }

      } catch (error) {
        console.error('Error checking movie existence:', error);
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
        'https://film-central-backend.vercel.app/towatchlist/entries',
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
      {/* What should go here? */}
      <Link to={`/movies/${id}`}>Movie Details</Link>
      <div>
        {/* <button onClick={promptForApiKey} disabled={isAdding}> */}
        <button onClick={addToWatchList} disabled={isAdding || isInWatchlist} className={isAdding ? "Adding..." : (isInWatchlist ? "disable" : " ")}> 
          {isAdding ? "Adding..." : (isInWatchlist ? "Already in a List" : "Quick Add to Watchlist")}
        </button>
      </div>
    </article>
  );
}

export default MovieCard;

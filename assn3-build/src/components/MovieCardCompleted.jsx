import { Link } from "react-router-dom";
import "../styles/MovieCard.css";

function MovieCardCompleted({ movie, id, completedId, apiKey }) {
  const alt = `${movie.title} poster`;

  if (movie.poster == "NA") {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
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
    </article>
  );
}

export default MovieCardCompleted;

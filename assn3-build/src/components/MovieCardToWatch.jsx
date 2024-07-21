import { Link } from "react-router-dom";
import "../styles/MovieCard.css";

function MovieCardTowatch({ movie, id, Watchlistid, apiKey }) {
  const alt = `${movie.title} poster`;

  if (movie.poster == "NA") {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }
  console.log(`${Watchlistid}`);
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
    </article>
  );
}

export default MovieCardTowatch;

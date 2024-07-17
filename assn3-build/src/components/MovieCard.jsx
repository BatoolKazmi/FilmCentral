import { Link } from "react-router-dom";
import "../styles/MovieCard.css"

function MovieCard({ movie, id }) {
    const alt = `${movie.title} poster`;

    if (movie.poster == 'NA') {
        movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
    }

    return (
        <article>
            <img src={movie.poster} alt={alt} />
            <h2>{movie.title}</h2>
            {/* What should go here? */}
            <Link to={`/movies/${id}`}>Movie Details</Link>
        </article>
    );
}

export default MovieCard;

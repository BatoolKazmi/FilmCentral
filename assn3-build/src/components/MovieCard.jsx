import { Link } from "react-router-dom";

function MovieCard({ movie, id }) {
    return (
        <article>
            <img src={movie.poster} alt={movie.title} />
            <h2>{movie.title}</h2>
            {/* What should go here? */}
            <Link to={`/movies/${id}`}>Movie Details</Link>
        </article>
    );
}

export default MovieCard;

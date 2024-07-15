import { Link } from "react-router-dom";

function MovieCard({ title, id }) {
    return (
        <article>
            <h2>{title} : {id}</h2>
            {/* What should go here? */}
            {/* <Link to={`/movie/${id}`}>Movie Details</Link> */}
        </article>
    );
}

export default MovieCard;

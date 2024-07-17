import MovieCard from "./MovieCard";

function MovieDeck({ movies }) {
    return (
        <>
            {movies.map((movie) => (
                <MovieCard movie={movie} id={movie.movieid} />
            ))}
        </>

    );
}

export default MovieDeck;

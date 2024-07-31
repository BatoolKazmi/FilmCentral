import MovieCard from "./MovieCard";

function MovieDeck({ movies }) {
    return (
        <>
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.movie_id} />
            ))}
        </>

    );
}

export default MovieDeck;

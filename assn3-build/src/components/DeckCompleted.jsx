import MovieCardCompleted from "./MovieCardCompleted";

function DeckCompleted({ movies, key, handleMovieRemoval }) {
    return (
        <>
            {movies.map((movie, i) => (
          <MovieCardCompleted
            movie={movie}
            key={i}
            completedId={movie.completedId}
            id={movie.movieid}
            // Batool
            //completedId={movie.completedWatchListId}
            apiKey={key}
            onRemove={handleMovieRemoval}
          />
        ))}
        </>

    );
}

export default DeckCompleted;

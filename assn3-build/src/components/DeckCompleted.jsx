import MovieCardCompleted from "./MovieCardCompleted";

function DeckCompleted({ movies, api, handleMovieRemoval }) {
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
            apiKey={api}
            onRemove={handleMovieRemoval}
          />
        ))}
        </>

    );
}

export default DeckCompleted;

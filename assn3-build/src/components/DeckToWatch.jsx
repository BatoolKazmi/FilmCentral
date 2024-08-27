import MovieCardTowatch from "./MovieCardToWatch";

function DeckToWatch({ movies, api, handleMovieRemoval }) {

    return (
        <>
            {movies.map((movie, i) => (
          <MovieCardTowatch
            movie={movie}
            key={i}
            id={movie.movieid}
            // Shelmah
            // Watchlistid={movie.Watchlistid}
            Watchlistid={movie.watchListId}
            onRemove={handleMovieRemoval}
            apiKey={api}
          />

          
        ))}
        </>

    );
}

export default DeckToWatch;

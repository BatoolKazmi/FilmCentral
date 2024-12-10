import MovieCardToWatch from "./MovieCardToWatch";

function DeckToWatch({ movies, api, handleMovieRemoval }) {
  return (
    <>
      {movies.map((movie, i) => (
        <MovieCardToWatch
          movie={movie}
          key={i}
          id={movie.movieid}
          apiKey={api}
          onRemove={handleMovieRemoval}
        />
      ))}
    </>
  );
}

export default DeckToWatch;

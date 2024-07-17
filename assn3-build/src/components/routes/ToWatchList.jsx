import NavBar from "../NavBar";

function ToWatchList() {
    return (
      <>
        <header>
          <NavBar />
          <h1>my Watch List</h1>
          <FindMovie onKeySubmit={getMovies} />
        </header>
        <main>
          {/* Info goes here! */}
          {movies.map((movie) => (
            <MovieCard movie={movie} id={movie.movieid} />
          ))}
        </main>
      </>
    );
};

export default ToWatchList;

import { useEffect, useState } from "react";
import NavBar from "../NavBar";
// import MovieCard from "../MovieCard";
// import FindMovie from "../FindMovie";
// import MovieCardTowatch from "../MovieCardToWatch";
import Pagination from "../Pagination";
import axios from "axios";
// import DeckToWatch from "../DecktoWatch";
import DeckToWatch from "../DeckToWatch";

function ToWatchList() {
  const [movies, setMovies] = useState([]);
  const [key, setKey] = useState("");

  useEffect(() => {
    fetchMovies();
    fetchApiKey();
}, [key, movies]);

  async function fetchMovies() {
    try {
      const response = await axios.get('http://localhost:5000/api/towatchlist/entries', {withCredentials: true});
      if (Array.isArray(response.data)) {
        setMovies(response.data);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  }


  async function fetchApiKey() {
    try {
      const response = await axios.get('http://localhost:5000/api/getApiKey', { withCredentials: true });
      setKey(response.data.apiKey);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    }
  }

  // function handleMovieRemoval() {
  //   fetchMovie(); // Refresh the movie list
  // }

  function handleMovieRemoval(id) {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.movieid !== id));
  }


  // Adding pagination
    ///
    const [currentPage, setCurrentPage] = useState(1);
    // Do like 20, 30, 40 or 50
    const [moviesPerPage, setmoviesPerPage] = useState(20);

    const lastPostIndex = currentPage * moviesPerPage;
    const firstPostIndex = lastPostIndex - moviesPerPage;

    const currentPosts = movies.slice(firstPostIndex, lastPostIndex);


  return (
    <>
      <header>
        <NavBar />
        <h1>To Watch List</h1>
        <p>To Watch List is ordered by Priority</p>
        {/* <FindMovie onKeySubmit={getMovies} /> */}
      </header>
      <div>
                <Pagination
                    currentPage={currentPage}
                    total={movies.length}
                    limit={20}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
      <main>
        {/* Info goes here! */}
        <DeckToWatch movies={currentPosts} key={key} handleMovieRemoval={handleMovieRemoval}/>
      </main>
      <div>
          <Pagination
              currentPage={currentPage}
              total={movies.length}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
          />
      </div>
    </>
  );
}

export default ToWatchList;

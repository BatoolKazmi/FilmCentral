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

  // FILTERATION
  const [name, setName] = useState("");

  // function getFilter(name) {
  //   setTitle(name);
  // }

  const updateSearch = (ev) => {
    setName(ev.target.value);
  }

  useEffect(() => {
    fetchMovies();
  }, [movies]);

  // HANDLE SUBMISSION
  const handleSubmit = (ev) => {
    ev.preventDefault();
    // filters(name);
    setName("")
    currentPage(1);
    fetchMovies();
}

  // Filter stuff ends

  useEffect(() => {
    async function fetchKeyAndMovies() {
      await fetchApiKey();
      fetchMovies();
    }
    fetchKeyAndMovies();
  }, []);
  
  useEffect(() => {
    fetchApiKey();
  }, [movies]);
  
  async function fetchMovies() {
    try {
      const response = await axios.get('http://localhost:5000/api/towatchlist/entries', {
          params: { title: name }, // Pass title as query parameter
          withCredentials: true
        });
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
    setMovies((prevMovies) => {
      const updatedMovies = prevMovies.filter((movie) => movie.movieid !== id);
      if (currentPage > 1 && updatedMovies.length <= firstPostIndex) {
        setCurrentPage(currentPage - 1);
      }
      return updatedMovies;
    });
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
      <form
        className="FilterForm"
        onSubmit={handleSubmit}>
        <div>
            <label htmlFor="search">Search the Title: </label>
            <input
                type="text"
                name="search"
                id="search"
                value={name}
                onChange={updateSearch} 
                placeholder="Search a Title of a Movie" />
        </div>
      </form>
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
        {key && (
        <DeckToWatch
          movies={currentPosts}
          api={key}
          handleMovieRemoval={handleMovieRemoval}
        />
      )}
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

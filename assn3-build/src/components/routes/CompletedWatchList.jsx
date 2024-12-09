import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCardCompleted from "../MovieCardCompleted";
import FindMovie from "../FindMovie";
import Pagination from "../Pagination";
import Logout from "../LoginSignup/Logout";
import axios from "axios";
import DeckCompleted from "../DeckCompleted";
import "../../styles/MovieCard.css";
import "../../styles/filterform.css"

function CompletedWatchList() {
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
    fetchApiKey();
  }, [movies, name]);

  // HANDLE SUBMISSION
  const handleSubmit = (ev) => {
    ev.preventDefault();
    // filters(name);
    setName("")
    page(1);
    fetchMovies();
  }

  async function fetchMovies() {
    let apiUrl = 'https://film-central-end.vercel.app/completedwatchlist/entries';
    if (name) {
        apiUrl += `?name=${name}`;
    }

    try {
      const response = await axios.get( apiUrl, {
        params: { title: name }, // Pass title as query parameter
        headers: { 'X-API-KEY': key },
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
      const response = await axios.get('https://film-central-end.vercel.app/api/getApiKey', { withCredentials: true });
      setKey(response.data.apiKey);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    }
  }

  function handleMovieRemoval(id) {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.completedId !== id));
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
        <h1>Completed Watch List ✅🎬</h1>
        <p>Completed Watch List is ordered by Rating</p>
        {/* <FindMovie onKeySubmit={getMovies} /> */}
      </header>
      <form
        className="FilterForm"
        onSubmit={handleSubmit}>
        <div>
            <label htmlFor="search">Search the Title </label>
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
      <div className="movies">
        {/* Info goes here! */}
        <DeckCompleted movies={currentPosts} api={key} handleMovieRemoval={handleMovieRemoval} />
      </div>
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

export default CompletedWatchList;

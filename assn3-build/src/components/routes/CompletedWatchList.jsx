import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import Pagination from "../Pagination";
import axios from "axios";
import DeckCompleted from "../DeckCompleted";
import "../../styles/MovieCard.css";
import "../../styles/filterform.css";

function CompletedWatchList() {
  const [movies, setMovies] = useState([]);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [loadingMovies, setLoadingMovies] = useState(false); // Loading state for movies
  const [loadingKey, setLoadingKey] = useState(false); // Loading state for API key
  const [currentPage, setCurrentPage] = useState(1);
  const [moviesPerPage] = useState(20);

  const updateSearch = (ev) => {
    setName(ev.target.value);
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setName("");
    setCurrentPage(1);
    fetchMovies();
  };

  useEffect(() => {
    fetchApiKey();
    fetchMovies();
  }, [name]);

  async function fetchMovies() {
    setLoadingMovies(true); // Start loading movies
    let apiUrl = "https://film-central-end.vercel.app/completedwatchlist/entries";
    if (name) {
      apiUrl += `?name=${name}`;
    }

    try {
      const response = await axios.get(apiUrl, {
        params: { title: name },
        headers: { "X-API-KEY": key },
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setMovies(response.data);
      } else {
        console.error("API response is not an array:", response.data);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    } finally {
      setLoadingMovies(false); // End loading movies
    }
  }

  async function fetchApiKey() {
    setLoadingKey(true); // Start loading API key
    try {
      const response = await axios.get(
        "https://film-central-end.vercel.app/api/getApiKey",
        { withCredentials: true }
      );
      setKey(response.data.apiKey);
    } catch (error) {
      console.error("Failed to fetch API key:", error);
    } finally {
      setLoadingKey(false); // End loading API key
    }
  }

  function handleMovieRemoval(id) {
    setMovies((prevMovies) => prevMovies.filter((movie) => movie.completedId !== id));
  }

  const lastPostIndex = currentPage * moviesPerPage;
  const firstPostIndex = lastPostIndex - moviesPerPage;
  const currentPosts = movies.slice(firstPostIndex, lastPostIndex);

  return (
    <>
      <header>
        <NavBar />
        <h1>Completed Watch List ✅🎬</h1>
        <p>Completed Watch List is ordered by Rating</p>
      </header>
      <form className="FilterForm" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="search">Search the Title </label>
          <input
            type="text"
            name="search"
            id="search"
            value={name}
            onChange={updateSearch}
            placeholder="Search a Title of a Movie"
          />
        </div>
      </form>
      {(loadingMovies || loadingKey) ? (
        <div className="loading-container">
          <p>Loading movies, please wait...</p>
        </div>
      ) : (
        <>
          <div>
            <Pagination
              currentPage={currentPage}
              total={movies.length}
              limit={20}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <div className="movies">
            {key && (
              <DeckCompleted
                movies={currentPosts}
                api={key}
                handleMovieRemoval={handleMovieRemoval}
              />
            )}
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
      )}
    </>
  );
}

export default CompletedWatchList;

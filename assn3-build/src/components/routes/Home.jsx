import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FilterForm from "../FilterForm";
import MovieDeck from "../MovieDeck";
import Pagination from "../Pagination";
import "../../styles/MovieCard.css";

function Home() {
    const [movies, setMovies] = useState([]);
    const [name, setName] = useState("");
    const [rate, setRate] = useState("");
    const [genre, setGenre] = useState("");
    const [company, setCompany] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [loading, setLoading] = useState(false); // Added loading state

    function getFilter(name, rate, genre, company) {
        setName(name);
        setRate(rate);
        setGenre(genre);
        setCompany(company);
    }

    // Fetch movies based on filters
    async function fetchMovies() {
        try {
            setLoading(true); // Set loading to true before fetching
            let apiUrl = 'https://film-central-end.vercel.app/movies';
            if (name || rate || genre || company) {
                apiUrl += `?title=${name}&vote_average=${rate}&genres=${genre}&company=${company}`;
            }

            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const jsonResponse = await response.json();
            setMovies(jsonResponse);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false); // Set loading to false after fetching
        }
    }

    useEffect(() => {
        fetchMovies();
    }, [name, rate, genre, company]);

    // Adding pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [moviesPerPage] = useState(30);

    const lastPostIndex = currentPage * moviesPerPage;
    const firstPostIndex = lastPostIndex - moviesPerPage;

    const currentPosts = movies.slice(firstPostIndex, lastPostIndex);

    const toggleFilters = () => {
        setShowFilters(prev => !prev);
    };

    return (
        <>
            <header>
                <NavBar />
                <h1>🎞️ FilmCentral 🎥</h1>
                <button onClick={toggleFilters}>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
                {showFilters && (
                    <FilterForm filters={getFilter} page={setCurrentPage} />
                )}
            </header>

            {loading ? (
                <div className="loading">Loading movies, please wait...</div>
            ) : (
                <>
                    <div>
                        <Pagination
                            currentPage={currentPage}
                            total={movies.length}
                            limit={30}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>

                    <div className="movies">
                        <MovieDeck movies={currentPosts} />
                    </div>

                    <div>
                        <Pagination
                            currentPage={currentPage}
                            total={movies.length}
                            limit={30}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </>
            )}
        </>
    );
}

export default Home;

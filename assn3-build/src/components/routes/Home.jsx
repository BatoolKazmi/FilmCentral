import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FilterForm from "../FilterForm";
import MovieDeck from "../MovieDeck";
import Pagination from "../Pagination";
import Logout from "../LoginSignup/Logout"

function Home() {
    const [movies, setMovies] = useState([]);
    const [name, setName] = useState("");
    const [rate, setRate] = useState("");
    const [genre, setGenre] = useState("")

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/movie/?title=${name}&vote_average=${rate}&genres=${genre}`;

    function getFilter(name, rate, genre) {
        setName(name);
        setRate(rate);
        setGenre(genre);
    }

    async function fetchContact() {
        const resp = await fetch(API);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setMovies(set);
    }

    useEffect(() => {
        fetchContact();
    }, [name, rate, genre]);

    // Adding pagination
    ///
    const [currentPage, setCurrentPage] = useState(1);
    // Do like 20, 30, 40 or 50
    const [moviesPerPage, setmoviesPerPage] = useState(30);

    const lastPostIndex = currentPage * moviesPerPage;
    const firstPostIndex = lastPostIndex - moviesPerPage;

    const currentPosts = movies.slice(firstPostIndex, lastPostIndex);


    return (
        <>
            <header>
                {/* What component should go here? */}
                <NavBar />
                <h1>Movies</h1>
                <FilterForm filters={getFilter} page={setCurrentPage} />
            </header>
            <Logout/>
            <div>
                <Pagination
                    currentPage={currentPage}
                    total={movies.length}
                    limit={30}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
            <main>
                {/* Info goes here! */}
                <MovieDeck movies={currentPosts} />
            </main>
            <div>
                <Pagination
                    currentPage={currentPage}
                    total={movies.length}
                    limit={30}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

        </>
    )
};

export default Home;

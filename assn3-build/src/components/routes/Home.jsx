import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";
import FilterForm from "../FilterForm";

function Home() {
    const [movies, setMovies] = useState([]);
    const [name, setName] = useState("");
    const [rate, setRate] = useState("");

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/movie/?title=${name}&vote_average=${rate}`;

    function getFilter(name, rate) {
        setName(name);
        setRate(rate);
    }

    async function fetchContact() {
        const resp = await fetch(API);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setMovies(set);
    }

    useEffect(() => {
        fetchContact();
    }, [name, rate]);

    // function getMovies(name) {

    // }


    return (
        <>
            <header>
                {/* What component should go here? */}
                <NavBar />
                <h1>Movies</h1>
                <FilterForm filters={getFilter} />
            </header>
            <main>
                {/* Info goes here! */}
                {movies.map((movie) => (
                    <MovieCard movie={movie} id={movie.movieid} />
                ))}
            </main>
        </>
    )
};

export default Home;

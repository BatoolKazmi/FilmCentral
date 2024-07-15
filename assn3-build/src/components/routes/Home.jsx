import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import MovieCard from "../MovieCard";

function Home() {
    const [movies, setMovies] = useState([]);

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/movie/`;

    async function fetchContact() {
        const resp = await fetch(API);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setMovies(set);
    }

    useEffect(() => {
        fetchContact();
    }, []);

    return (
        <>
            <header>
                {/* What component should go here? */}
                <NavBar />
                <h1>Home Page</h1>
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

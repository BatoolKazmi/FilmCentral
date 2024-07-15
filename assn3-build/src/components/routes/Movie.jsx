import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function Movie() {
    let { id } = useParams();
    const [movie, setMovie] = useState([]);

    const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/movie/${id}`;



    async function fetchContact() {
        const resp = await fetch(API);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setMovie(set);
    }

    useEffect(() => {
        // Parse the genres string into an array
        fetchContact();
    }, []);


    // IDK HOW TO EXTRACT GENRES NAMES
    // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES

    return (
        <>
            <NavBar />
            <h1>{movie.title}</h1>
            <img src={movie.poster} alt={movie.title} />
            <p><strong>Tagline:</strong> {movie.tagline}</p>
            <p><strong>Overview:</strong> {movie.overview}</p>
            <p><strong>Release Date:</strong> {movie.release_date}</p>
            <p><strong>Runtime:</strong> {movie.runtime} minutes</p>
            <p><strong>Vote Average:</strong> {movie.vote_average}</p>
            <p><strong>Vote Count:</strong> {movie.vote_count}</p>
            <p><strong>Original Language:</strong> {movie.original_language}</p>
            {/* GENRES & PRODUCTION COMPANIES??? */}
        </>
    );
};

export default Movie;

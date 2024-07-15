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

    return (
        <>
            <NavBar />
            <h1>{movie.title}</h1>
            <img src={movie.poster} alt={movie.title} />
            <p>Runtime: {movie.runtime} minutes</p>
            <p>Vote Average: {movie.vote_average}</p>
        </>
    );
};

export default Movie;

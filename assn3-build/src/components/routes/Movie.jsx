import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function Movie() {
  let { id } = useParams();
  const [movie, setMovie] = useState({});

  async function fetchMovie() {
    try {
        const API = `http://localhost:5000/movies/${id}`;
        const response = await fetch(API);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const jsonResponse = await response.json();
        console.log("Fetched Movie Data:", jsonResponse);

        if (jsonResponse.length > 0) {
            setMovie(jsonResponse[0]); // Use the first item of the array
        } else {
            console.error('No movie found with the given ID.');
            // Handle no movie found case
            setMovie({});
        }
    } catch (error) {
        console.error('Error fetching movie data:', error);
    }
}

  useEffect(() => {
    // Parse the genres string into an array
    fetchMovie();
  }, []);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  return (
    <>
      <NavBar />
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} />
      <p>
        <strong>Tagline:</strong> {movie.tagline}
      </p>
      <p>
        <strong>Overview:</strong> {movie.overview}
      </p>
      <p>
        <strong>Release Date:</strong> {movie.release_date}
      </p>
      <p>
        <strong>Runtime:</strong> {movie.runtime} minutes
      </p>
      <p>
        <strong>Vote Average:</strong> {movie.vote_average}
      </p>
      <p>
        <strong>Vote Count:</strong> {movie.vote_count}
      </p>
      <p>
        <strong>Original Language:</strong> {movie.original_language}
      </p>

      <p>
        <strong>Genres:</strong> {movie.genre_names ? movie.genre_names.replace(/,/g, ", ") : ""}
      </p>
      {/* PRODUCTION COMPANIES??? */}
      <p>
        <strong>Production Company:</strong> {movie.company_names ? movie.company_names.replace(/,/g, ", ") : ""}
      </p>
    </>
  );
}

export default Movie;

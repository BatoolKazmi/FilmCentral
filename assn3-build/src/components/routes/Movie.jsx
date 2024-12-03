import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import "../../styles/details.css"

function Movie() {
  let { id } = useParams();
  const [movie, setMovie] = useState({});

  async function fetchMovie() {
    try {
        const API = `https://film-central-backend.vercel.app/movies/${id}`;
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
      <div className="movie-details">
        <h1>{movie.title}</h1>
        <img src={movie.poster} alt={movie.title} />

        <div className="user-stats">
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Tagline</td>
                <td>{movie.tagline}</td>
              </tr>
              <tr>
                <td>Overview</td>
                <td>{movie.overview}</td>
              </tr>
              <tr>
                <td>Release Date</td>
                <td>{movie.release_date}</td>
              </tr>
              <tr>
                <td>Runtime</td>
                <td>{movie.runtime} minutes</td>
              </tr>
              <tr>
                <td>Vote Average</td>
                <td>{movie.vote_average}</td>
              </tr>
              <tr>
                <td>Vote Count</td>
                <td>{movie.vote_count}</td>
              </tr>
              <tr>
                <td>Original Language</td>
                <td>{movie.original_language}</td>
              </tr>
              <tr>
                <td>Genres</td>
                <td>{movie.genre_names ? movie.genre_names.replace(/,/g, ", ") : ""}</td>
              </tr>
              <tr>
                <td>Production Company</td>
                <td>{movie.company_names ? movie.company_names.replace(/,/g, ", ") : ""}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>

  );
}

export default Movie;

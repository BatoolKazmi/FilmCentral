import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function CompletedMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [timesWatched, setTimesWatched] = useState(0);
  const [rating, setRating] = useState("");
  const [newNotes, setNewNotes] = useState(""); 

  if (movie.poster === null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}?key=${key}`;
  const API = `http://localhost:5000/completedwatchlist/entries/${id}/${key}`;
  const notesAPI = `http://localhost:5000/completedwatchlist/entries/${id}/notes`;

  async function fetchContact() {
    const resp = await fetch(API);
    const jsonResponse = await resp.json();
    const set = jsonResponse;
    setMovie(set);
    setTimesWatched(jsonResponse.times_watched || 0);
    setRating(jsonResponse.rating || "");
    setNewNotes(jsonResponse.notes || ""); 
    // setPriority(jsonResponse.priority || "Select");
  }

  // IDK HOW TO EXTRACT GENRES NAMES
  // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES
  async function updateTimesWatched() {
    // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}/times-watched`;
    const updateAPI = `http://localhost:5000/completedwatchlist/entries/${id}/times-watched`
    const response = await fetch(updateAPI, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({key: key}),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      setTimesWatched(jsonResponse.times_watched);
    } else {
      console.error("Failed to update times watched");
    }
  }

  async function decrementTimesWatched() {
    const updateAPI = `http://localhost:5000/completedwatchlist/entries/${id}/times-watched/decrease`;
    
    try {
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: key }),
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        // Assuming the backend responds with the updated 'times_watched' count
        setTimesWatched(jsonResponse.times_watched);
      } else {
        console.error("Failed to update times watched");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  

  async function updateRating(newRating) {
    try {
      // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn2/cois-3430-2024su-a2-Shelmah/api/completedwatchlist/entries/${id}/rating?key=${key}`;
      const updateAPI = `http://localhost:5000/completedwatchlist/entries/${id}/rating`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({key: key, rating: newRating }),
      });
      if (response.ok) {
        setRating(newRating);
      } else {
        const errorResponse = await response.text(); // Get the error response from the server
        console.error("Failed to update rating:", response.statusText, errorResponse);
      }
    } catch (error) {
      console.error("Error updating rating:", error);
    }
  }

  function handleRatingChange(event) {
    const newRating = event.target.value;
    setRating(newRating); // Update state immediately
    if (newRating !== "Select") {
      updateRating(newRating); // Only send update if not "Select"
    }
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key, rating, timesWatched]);

  // UPDATING NOTES
  async function updateNotes() {
    try {
      const response = await fetch(notesAPI, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ notes: newNotes, key: key }),  // Use the newNotes state
      });
      if (response.ok) {
        setMovie(prevMovie => ({ ...prevMovie, notes: newNotes })); // Update the movie state with new notes
        setNewNotes("");
      } else {
        const errorResponse = await response.text(); // Get the error response from the server
        console.error("Failed to update notes:", response.statusText, errorResponse);
      }
    } catch (error) {
      console.error("Error updating notes:", error);
    }
  }

  function handleNotesChange(event) {
    setNewNotes(event.target.value);  // Store the new value in the newNotes state
  }

  function handleNotesSubmit() {
    updateNotes();  // Update the notes when the submit button is clicked
  }

  return (
    <>
      <NavBar />
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} />
        <p><strong>Rating:</strong> {(!rating) ? movie.rating : rating}</p>
        <div>
        <label htmlFor="score">Update Rating (?/10):</label>
        <select
          name="score"
          id="score"
          value={rating}
          onChange={handleRatingChange}
        >
          {/* <option value="Select">Select</option> */}
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>
      <p>
        <strong>Notes:</strong> {movie.notes}
      </p>
      <div>
        <label htmlFor="notes">Update Notes:</label>
        <textarea
          name="notes"
          id="notes"
          value={newNotes}  // Display the value being edited for notes
          onChange={handleNotesChange}  // Update the newNotes state on change
        />
        <button onClick={handleNotesSubmit}>Submit Notes</button>  {/* Submit button for the notes */}
      </div>
      <p>
        <strong>First watched on:</strong> {movie.date_initially_watched}
      </p>
      <p>
        <strong>Last watched on:</strong> {movie.date_last_watched}
      </p>
      <p>
        <strong>Times Watched:</strong> {timesWatched}
      </p>
      <button onClick={updateTimesWatched}>Increase Times Watched</button>
      <button onClick={decrementTimesWatched}>Decrease Times Watched</button>
      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default CompletedMovies;

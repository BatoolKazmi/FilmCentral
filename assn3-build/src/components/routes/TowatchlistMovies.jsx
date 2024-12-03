import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";
import "../../styles/towatchdetails.css";

function ToWatchListMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [newNotes, setNewNotes] = useState(""); 
  const label = `Update Priority (?/10): `;

  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}?key=${key}`;
  const API = `https://film-central-backend.vercel.app/towatchlist/entries/${id}/${key}`;

  async function fetchContact() {
    console.log(API)

    const resp = await fetch(API, {
      headers: {
        'x-api-key':key,  // Add your API key here
      },
      withCredentials: true
    });
  
    const jsonResponse = await resp.json();
    const set = jsonResponse[0];

    setMovie(set);
    setPriority(jsonResponse.priority); 
    setNotes(jsonResponse.notes);
    setNewNotes(jsonResponse.notes);
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key], priority, notes, newNotes);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function updatePriority(newPriority) {
    try {
      // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}/priority?key=${key}`;
      const updateAPI = `https://film-central-backend.vercel.app/towatchlist/entries/${id}/priority`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, priority: newPriority }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setPriority(newPriority);
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  }

  async function updateNotes() {
    try {
      const updateAPI = `https://film-central-backend.vercel.app/towatchlist/entries/${id}/notes`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key, notes: newNotes }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setNotes(newNotes);
      // Optionally, you could show a success message or update the UI to reflect that the notes were updated
    } catch (error) {
      console.error("Failed to update notes:", error);
    }
  }

  function handleNotesChange(event) {
    setNewNotes(event.target.value); 
  }

  function handleNotesSubmit() {
    updateNotes(); // Send update when the user clicks the submit button
    setNewNotes("");
  }

  function handlePriorityChange(event) {
    const newPriority = event.target.value;
    setPriority(newPriority); // Update state immediately
    if (newPriority !== "Select") {
      updatePriority(newPriority); // Only send update if not "Select"
    }
  }
  // console.log(`${(key, priority)}`);
  // IDK HOW TO EXTRACT GENRES NAMES
  // IDK WHAT TO DO WITH GENRES AND PRODUCTION COMPANIES

  return (
    <>
      <NavBar />
      <h1>{movie.title}</h1>
      <img src={movie.poster} alt={movie.title} />
      <div className="movie-options">
        {/* Priority Section */}
        <div className="movie-priority">
          <h3>Priority:</h3>
          <p>
            {(!priority) ? movie.priority : priority}
          </p>
        </div>

        <div className="priority-selection">
          <label htmlFor="priority">{label}</label>
          <select
            name="priority"
            id="priority"
            value={priority}
            onChange={handlePriorityChange}
          >
            <option value="">Select</option>
            {[...Array(10).keys()].map(i => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Notes Section */}
        <h3>Notes</h3>
        <div className="movie-notes">
          {(!notes) ? movie.notes : notes}
        </div>

        <div className="notes-section">
          <label htmlFor="notes">Write a new note:</label>
          <textarea
            name="notes"
            id="notes"
            value={newNotes}
            onChange={handleNotesChange}
            placeholder="Write your notes here..."
          />
          <button onClick={handleNotesSubmit}>Submit</button>
        </div>
      </div>
      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default ToWatchListMovies;

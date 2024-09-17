import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function ToWatchListMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [priority, setPriority] = useState("");
  const [notes, setNotes] = useState("");
  const [newNotes, setNewNotes] = useState(""); 
  const label = `Update Priority (?/10): `;

  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}?key=${key}`;
  const API = `http://localhost:5000/towatchlist/entries/${id}/${key}`;

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
    setPriority(jsonResponse.priority || "Select"); // Ensure default is set properly
    setNotes(jsonResponse.notes || "");
    setNewNotes(jsonResponse.notes || "");
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key]);

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }

  async function updatePriority(newPriority) {
    try {
      // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}/priority?key=${key}`;
      const updateAPI = `http://localhost:5000/towatchlist/entries/${id}/priority`;
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
      const updateAPI = `http://localhost:5000/towatchlist/entries/${id}/notes?key=${key}`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, notes: newNotes }),
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
      <p>
        <strong>Priority:</strong> {priority}
      </p>
      <div>
        <label htmlFor="priority">{label}</label>
        <select
          name="priority"
          id="priority"
          value={priority}
          onChange={handlePriorityChange}
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
        <strong>Notes:</strong> {notes}
      </p>
      <textarea
        name="notes"
        id="notes"
        value={newNotes}
        onChange={handleNotesChange} // Update state on change
      />
      <button onClick={handleNotesSubmit}>Submit</button>

      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default ToWatchListMovies;

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import NavBar from "../NavBar";

function ToWatchListMovies() {
  const { key, id } = useParams();
  const [movie, setMovie] = useState([]);
  const [priority, setPriority] = useState("");
  const label = `Update Priority (?/10): `;

  if (movie.poster == null) {
    movie.poster = "https://wallpapercave.com/wp/wp6408959.jpg";
  }
  //const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/movies/${id}`;
  // const API = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}?key=${key}`;
  const API = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/towatchlist/entries/${id}?key=${key}`;

  async function fetchContact() {
    const resp = await fetch(API);
    const jsonResponse = await resp.json();
    const set = jsonResponse;
    setMovie(set);
    setPriority(jsonResponse.priority || "Select"); // Ensure default is set properly
  }

  useEffect(() => {
    // Parse the genres string into an array
    fetchContact();
  }, [key]);

  async function updatePriority(newPriority) {
    try {
      // const updateAPI = `https://loki.trentu.ca/~shelmahkipngetich/3430/assn2/cois-3430-2024su-a2-Shelmah/api/towatchlist/entries/${id}/priority?key=${key}`;
      const updateAPI = `https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/towatchlist/entries/${id}/priority?key=${key}`;
      const response = await fetch(updateAPI, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, priority: newPriority }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      setPriority(newPriority);
    } catch (error) {
      console.error("Failed to update priority:", error);
    }
  }

  function handlePriorityChange(event) {
    const newPriority = event.target.value;
    setPriority(newPriority); // Update state immediately
    if (newPriority !== "Select") {
      updatePriority(newPriority); // Only send update if not "Select"
    }
  }
  console.log(`${(key, priority)}`);
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
          <option value="Select">Select</option>
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
      {/* GENRES & PRODUCTION COMPANIES??? */}
    </>
  );
}

export default ToWatchListMovies;

import { useState, useEffect } from "react";

function FilterForm({ filters, page }) {

    const [see, setSearch] = useState("");
    const [rate, setRate] = useState("");
    // GENRES
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState("");


    const updateSearch = (ev) => {
        console.log("Change event!");
        console.log(ev);
        setSearch(ev.target.value);
    }

    const updateRate = (ev) => {
        console.log("Change event!");
        console.log(ev);
        setRate(ev.target.value);
    }

    const updateGenres = (ev) => {
        console.log("Change event!");
        console.log(ev);
        setGenre(ev.target.value);
    }

    const label = `Rating (?/10): `;


    async function fetchContact() {
        const genresApi = "https://loki.trentu.ca/~batoolkazmi/3430/assn2/cois-3430-2024su-a2-Batool-Kazmi/api/genres/";
        const resp = await fetch(genresApi);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setGenres(set);
    }

    useEffect(() => {
        fetchContact();
    }, []);
    

    // HANDLE SUBMISSION
    const handleSubmit = (ev) => {
        ev.preventDefault();
        filters(see, rate, genre);
        setSearch("");
        setRate("");
        setGenre("")
        page(1);
    }

    return (
        <>
            <form
                className="FilterForm"
                onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="search">Search the Title: </label>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={see}
                        onChange={updateSearch} />
                </div>

                <div>
                    <label htmlFor="rate">{label}</label>
                    <select name="rate" id="rate" value={rate} onChange={updateRate}>
                        <option value="Select">Select Rating</option>
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

                <div>
                    <label htmlFor="genres">Genre Type: </label>
                    <select name="genres" id="genres" value={genre} onChange={updateGenres}>
                        <option value="Select">Select Genre</option>
                        {genres.map((genre, index) => (
                            <option value={genre.name} key={index}>{genre.name}</option>
                        ))}
                    </select>
                </div>


                <button>Find Movie!</button>
            </form>
        </>
    );
}

export default FilterForm;

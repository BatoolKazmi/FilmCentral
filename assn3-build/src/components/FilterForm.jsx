import { useState, useEffect } from "react";

function FilterForm({ filters, page }) {

    const [see, setSearch] = useState("");
    const [rate, setRate] = useState("");


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


    const label = `Rating (>=) out of 10: `;

    // GENRES
    const [genres, setGenres] = useState([]);



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

    const [genre, setGenre] = useState("");

    const updateGenres = (ev) => {
        console.log("Change event!");
        console.log(ev);
        setGenre(ev.target.value);
    }

    // HANDLE SUBMISSION
    const handleSubmit = (ev) => {
        ev.preventDefault();
        filters(see, rate, genre);
        setSearch("");
        setRate("");
        page(1);
    }

    return (
        <>
            <form
                className="FilterForm"
                onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="search">Search the title of a movie</label>
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
                        <option value="Select">Select Genre</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                </div>

                <div>
                    <label for="genres" sr-only>Genre Type: </label>
                    <select name="genres" id="genres" value={genre} onChange={updateGenres}>
                        <option value="Select">Select Genre</option>
                        {genres.map((genre, index) => (
                            <option value={genre.name} id={index}>{genre.name}</option>
                        ))}
                    </select>
                </div>


                <button>Find Movie!</button>
            </form>
        </>
    );
}

export default FilterForm;

import { useState, useEffect } from "react";
import "../styles/filterform.css"

function FilterForm({ filters, page }) {

    const [see, setSearch] = useState("");
    const [rate, setRate] = useState("");
    // GENRES
    const [genres, setGenres] = useState([]);
    const [genre, setGenre] = useState("");

    // Production  companies
    const [companies, setCompanies] = useState([]);
    const [company, setCompany] = useState("");
    const [companySearch, setCompanySearch] = useState(""); // New state for company search

    const updateCompanySearch = (ev) => setCompanySearch(ev.target.value); // Update company search query

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

    const selectCompany = (companyName) => {
        setCompany(companyName);
        setCompanySearch(""); // Clear search input after selection
    };

    const label = `Rating (?/10): `;


    async function fetchContact() {
        const genresApi = "http://localhost:5000/genres";
        const resp = await fetch(genresApi);
        const jsonResponse = await resp.json();
        const set = jsonResponse;
        setGenres(set);

        const companyApi = "http://localhost:5000/companies";
        const rep = await fetch(companyApi);
        const json = await rep.json();
        const comp = json;
        setCompanies(comp);
    }

    useEffect(() => {
        fetchContact();
    }, []);
    

    // HANDLE SUBMISSION
    const handleSubmit = (ev) => {
        ev.preventDefault();
        filters(see, rate, genre, company);
        setSearch("");
        setRate("");
        setGenre("");
        setCompany("");
        page(1);
    }

    // Filter companies based on search input
    const filteredCompanies = companies.filter((company) =>
        company.name.toLowerCase().includes(companySearch.toLowerCase())
    );

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
                        onChange={updateSearch} 
                        placeholder="Search a Title of a Movie" />
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
                <div className="selectBox">
                    <label htmlFor="companies">Production Company: </label>
                    <input type="text" 
                        className="search-box" 
                        placeholder="Select Company" 
                        onChange={updateCompanySearch}
                        value={companySearch} /> 
                    <ul className="options">
                        <ul className="options">
                            {/* <li value="Select">Select Company</li>
                            {companies.map((company, index) => (
                                <li value={company.name} key={index}>{company.name}</li>
                            ))} */}
                             {filteredCompanies.length > 0 ? (
                                filteredCompanies.map((company, index) => (
                            <li
                                key={index}
                                onClick={() => selectCompany(company.name)}
                                className={company === company.name ? "selected" : ""}
                            >
                                {company.name}
                            </li>
                            ))
                            ) : (
                                <li>No matching companies</li>
                            )}
                        </ul>
                    </ul>
                    <div className="selected-option" value>{company || "Select an option"}</div> 
                    <button id="clear-button" onClick={() => setCompany("")} >Clear Selection</button>
                </div>

                <button>Find Movie!</button>
            </form>
        </>
    );
}

export default FilterForm;

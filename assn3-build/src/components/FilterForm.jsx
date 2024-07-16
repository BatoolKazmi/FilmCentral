import { useState, useEffect } from "react";

function FilterForm({ filters }) {

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

    const handleSubmit = (ev) => {
        ev.preventDefault();
        filters(see, rate);
        setSearch("");
        setRate("");
    }

    const label = `Rating (>=): `;

    return (
        <>
            <form
                className="FilterForm"
                onSubmit={handleSubmit}>
                <label htmlFor="search">Search the title of a movie</label>
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={see}
                    onChange={updateSearch} />

                <label htmlFor="rate">{label}</label>
                <input
                    type="number"
                    name="rate"
                    id="rate"
                    value={rate}
                    onChange={updateRate} />
                <button>Find Movie!</button>
            </form>
        </>
    );
}

export default FilterForm;

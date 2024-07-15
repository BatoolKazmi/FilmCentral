import { useState, useEffect } from "react";

export default function SearchForm({ search }) {
    const [see, setSearch] = useState("");
    // useEffect(function myEffect() {
    //   console.log("myEffect was called ");
    // });

    const updateSearch = (ev) => {
        console.log("Change event!");
        console.log(ev);
        setSearch(ev.target.value);
    }

    const handleSubmit = (ev) => {
        ev.preventDefault();
        search(see);
        setSearch("");
    }

    return (
        <>
            <form
                className="SearchForm"
                onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="search"
                    id="search"
                    value={see}
                    onChange={updateSearch} />
                <button>Find Movie!</button>
            </form>
        </>
    );
}

import { useParams } from "react-router-dom";
import NavBar from "../NavBar";

function Movie() {
    let { id } = useParams();

    return (
        <>
            <NavBar />
            <h1>Movies {id}</h1>
        </>
    );
};

export default Movie;

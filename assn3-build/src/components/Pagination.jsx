import React from 'react'
import "../styles/Pagination.css"

export const Pagination = ({ totalMovies, moviesPerPage, setCurrentPage, currentPage }) => {
    let pages = [];

    for (var i = 1; i <= Math.ceil(totalMovies / moviesPerPage); i++) {
        pages.push(i);
    }

    return (
        <div>
            {
                pages.map((page, index) => {
                    return <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={page == currentPage ? 'active' : ''}
                    >
                        {page}
                    </button>
                })
            }
        </div>
    )
}

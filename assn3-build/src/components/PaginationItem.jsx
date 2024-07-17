import React from 'react'
import "../styles/Pagination.css"

function PaginationItem({ page, currentPage, onPageChange }) {

    return (
        <>
            <button
                className={page == currentPage ? 'current' : ''}
                onClick={() => onPageChange(page)}>
                {page}
            </button>
        </>
    );
}

export default PaginationItem;
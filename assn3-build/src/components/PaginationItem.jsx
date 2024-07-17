import React from 'react'
import "../styles/Pagination.css"

function PaginationItem({ page, currentPage, onPageChange, Deactivate }) {

    var name = `hello ${page == currentPage ? 'current' : ''}  ${Deactivate == true ? 'deactivate' : ""}`;

    return (
        <>
            <button
                className={name}
                onClick={() => onPageChange(page)}>
                {page}
            </button>
        </>
    );
}

export default PaginationItem;
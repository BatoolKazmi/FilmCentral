import React from 'react'
import "../styles/Pagination.css"
import PaginationItem from './PaginationItem';

function Pagination({ currentPage, total, limit, onPageChange }) {

    const pageCount = Math.ceil(total / limit);

    let pages = [];

    for (var i = 1; i <= pageCount; i++) {
        pages.push(i);
    }
    console.log("pagesCount", pageCount, pages);

    return (
        <>
            <PaginationItem
                page='<'
                currentPage={currentPage}
                onPageChange={currentPage <= 1 ? () => onPageChange(currentPage) : () => onPageChange(currentPage - 1)}
            />
            {pages.map((page, index) => (
                <PaginationItem
                    page={page}
                    key={index}
                    currentPage={currentPage}
                    onPageChange={onPageChange}
                />
            ))}
            <PaginationItem
                page='>'
                currentPage={currentPage}
                onPageChange={currentPage >= pageCount ? () => onPageChange(currentPage) : () => onPageChange(currentPage + 1)}
            />
        </>
    );
}

export default Pagination;
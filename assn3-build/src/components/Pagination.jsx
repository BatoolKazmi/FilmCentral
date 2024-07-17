import React from 'react'
import "../styles/Pagination.css"
import PaginationItem from './PaginationItem';


const getPagesCut = ({ pageCount, pagesCutCount, currentPage }) => {
    const ceiling = Math.ceil(pagesCutCount / 2);
    const floor = Math.floor(pagesCutCount / 2);

    if (pageCount < pagesCutCount) {
        return {
            start: 1, end: pageCount + 1
        };
    } else if (currentPage >= 1 && currentPage <= ceiling) {
        return {
            start: 1, end: pagesCutCount + 1
        };
    } else if (currentPage + floor >= pageCount) {
        return {
            start: pageCount - pagesCutCount + 1, end: pageCount + 1
        };
    } else {
        return {
            start: currentPage - ceiling + 1,
            end: currentPage + floor + 1
        };
    }
}

function Pagination({ currentPage, total, limit, onPageChange }) {

    const pageCount = Math.ceil(total / limit);
    const pagesCut = getPagesCut({ pageCount, pagesCutCount: 5, currentPage });

    let pages = [];

    for (var i = pagesCut.start; i <= pagesCut.end - 1; i++) {
        pages.push(i);
    }

    console.log(pageCount)

    return (
        <>
            <PaginationItem
                page='<<'
                currentPage={currentPage}
                onPageChange={() => onPageChange(1)}
            />
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
            <PaginationItem
                page='>>'
                currentPage={currentPage}
                onPageChange={() => onPageChange(pageCount)}
            />
        </>
    );
}

export default Pagination;
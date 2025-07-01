import React, { useState } from "react";
import { Table as BootstrapTable } from "react-bootstrap";

export default function TableComponent({
  dataArray = [],
  columnsArray = [],
  title = "Custom Table",
  message,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change this for more/less items per page

  const sqlExecutionSummary = message.length === 0 ? "success" : "failure";
  const tableTitle = message.length === 0 ? title : "Something went wrong";

  // Filter data based on search query
  const filteredData = dataArray.filter((row) =>
    columnsArray.some((col) =>
      String(row[col.key]).toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  return (
    <div className="custom-table-container">
      <h3 className={`table-title ${sqlExecutionSummary}`}>
        {title === "Query Log" ? title : tableTitle}
      </h3>

      <div className="table-scroll-wrapper">
        {message.length === 0 ? (
          <>
            <div className="search-box mb-3">
              <input
                type="text"
                placeholder="Search any item in table..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="form-control"
              />
            </div>
            <BootstrapTable striped bordered hover className="custom-table">
              <thead>
                <tr>
                  {columnsArray.map((col, index) => (
                    <th key={index}>{col.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {currentItems.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columnsArray.map((col, colIndex) => (
                      <td key={colIndex}>{row[col.key]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </BootstrapTable>

            {/* Pagination Controls */}
            <div className="pagination-controls mt-3">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                className="custom-button-cadet me-2"
              >
                &larr;
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                className="custom-button-teal ms-2"
              >
                &rarr;
              </button>
            </div>
          </>
        ) : (
          <h6>{message}</h6>
        )}
      </div>
    </div>
  );
}

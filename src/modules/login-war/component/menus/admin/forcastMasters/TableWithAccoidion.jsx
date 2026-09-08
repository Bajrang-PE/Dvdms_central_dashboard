import React, { useEffect, useState } from 'react'
import GlobalTable from '../../../GlobalTable';

const TableWithAccoidion = (props) => {
    const { data, column, id, heading, subHeading, defaultOpen, onClickRpt } = props;
    const [searchInput, setSearchInput] = useState("");
    const [filterData, setFilterData] = useState([]);

    useEffect(() => {
        if (!searchInput) {
            setFilterData(data);
        } else {
            const lowercasedText = searchInput.toLowerCase();

            const newFilteredData = data?.filter(row => {
                return column.some(col => {
                    const cellValue = row[col.name];
                    return cellValue && cellValue.toString().toLowerCase().includes(lowercasedText);
                });
            });
            setFilterData(newFilteredData);
        }
    }, [searchInput, data, column]);


    return (
        <div className="accordion my-3" id={`${id}_parent`}>
            <div className="accordion-item border-1 rounded-3">
                {/* Accordion Header */}
                <h2 className="accordion-header" id={`${id}_heading`}>
                    <button
                        className="accordion-button bg-grey text-dark fw-semibold shadow-none"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${id}`}
                        aria-expanded="true"
                        aria-controls={id}
                    >
                        <i className="fa-solid fa-chart-column me-2 text-primary"></i>
                        {heading}
                        {data?.length === 0 && <span className='text-danger ms-2 fs-13'>{`(No Data)`}</span>}
                    </button>
                </h2>

                {/* Accordion Collapsible Body */}
                <div
                    id={id}
                    className={`accordion-collapse collapse ${defaultOpen ? "show" : ""}`}
                    aria-labelledby={`${id}_heading`}
                    data-bs-parent={`#${id}_parent`}
                >
                    <div className="accordion-body p-3">
                        {subHeading &&
                            <div className="d-flex justify-content-between align-items-center flex-wrap">
                                <div className="year-summary-title">
                                    <div>
                                        <span className="badge bg-info-subtle text-dark border required-label fs-13 fw-medium">
                                            <i> {subHeading}</i>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        }
                        <GlobalTable
                            column={column}
                            data={filterData}
                            setSearchInput={setSearchInput}
                            isShowBtn={true}
                            isAdd={false}
                            isModify={false}
                            isDelete={false}
                            isView={false}
                            isReport={true}
                            onAdd={null}
                            onModify={null}
                            onDelete={null}
                            onView={null}
                            onReport={onClickRpt}
                            setOpenPage={() => { }}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TableWithAccoidion

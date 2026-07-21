import React, { useRef, useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

const Tabular = ({
    columns,
    data = [],
    pagination,
    recordsPerPage,
    fixedHeader,
    scrollHeight,
    headingFontColor,
    headingBgColor,
    headingAlignment,
    recordsPerPageOptions,
    isTableHeadingRequired,
    theme,
    noDataComponent,
    mainHeaders = [],
    sortConfig = [],
    onSortConfigChange,
    isRecordsLimitedLineRequired,
    allData,
    limit,
    isFirstRowHeading,
    setPageSize,
    setPageNumber, pageSize, pageNumber, totalCount, modeOfQuery
}) => {
    const tableRef = useRef();
    const headerRef = useRef();
    const scrollContainerRef = useRef();
    const [tableWidth, setTableWidth] = useState('100%');

    const [sortedData, setSortedData] = useState([]);
    const [allTrackData, setAllTrackData] = useState([]);

    // Helper: Detect date strings like "23-Jul-2025"
    const isDateString = (value) => {
        if (typeof value !== 'string') return false;
        // Match formats like: 23-Jul-2025, 2023-07-23, 07/23/2023, etc.
        return /^\d{1,2}-[A-Za-z]{3}-\d{4}$/.test(value.trim()) ||
            /^\d{4}-\d{1,2}-\d{1,2}$/.test(value.trim()) ||
            /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(value.trim());
    };

    // Parse date string to Date object
    const parseDate = (dateStr) => {
        if (dateStr.includes('-') && dateStr.length === 11) { // 23-Jul-2025 format
            const [day, month, year] = dateStr.split('-');
            const monthIndex = new Date(`${month} 1, 2000`).getMonth();
            return new Date(year, monthIndex, day);
        }
        return new Date(dateStr);
    };

    // Handle sort clicks
    const handleSort = (column, sortDirection) => {
        if (typeof column.selector !== 'function') return;

        onSortConfigChange(prev => {
            // Check if this column is already being sorted
            const existingIndex = prev.findIndex(s => s.selector === column.selector);

            if (existingIndex > -1) {
                // If same column clicked again, toggle direction
                if (prev.length === 1) {
                    return [{
                        selector: column.selector,
                        direction: sortDirection
                    }];
                }
                // Remove from sort if already sorted and not the only sort
                return prev.filter(s => s.selector !== column.selector);
            }

            // Add new sort (single sort - replace existing)
            return [{
                selector: column.selector,
                direction: sortDirection
            }];
        });
    };


    useEffect(() => {
        if (!sortConfig || sortConfig.length === 0) {
            setSortedData([...data]);
            setAllTrackData([...data]);
            return;
        }

        const sorted = [...data].sort((a, b) => {
            for (const config of sortConfig) {
                let col, direction, valA, valB;

                if (isFirstRowHeading === 'Yes' && config.name) {
                    direction = config.direction;
                    col = columns.find(c => c.mainHeader === config.name);
                } else if (config.selector) {
                    direction = config.direction;
                    col = columns.find(c => c.selector === config.selector);
                }

                if (!col) continue;

                valA = col.selector(a);
                valB = col.selector(b);

                // Handle date sorting
                if (isDateString(valA)) {
                    valA = parseDate(valA);
                    valB = isDateString(valB) ? parseDate(valB) : valB;
                }

                // Handle numeric sorting
                if (typeof valA === 'string' && !isNaN(valA)) {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }

                if (valA < valB) return direction === 'asc' ? -1 : 1;
                if (valA > valB) return direction === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setSortedData(sorted);
        setAllTrackData(data);
    }, [data, sortConfig, columns]);

    useEffect(() => {
        if (mainHeaders && mainHeaders.length > 0) {
            const totalWidth = mainHeaders.reduce((sum, header) => sum + (header.subHeaders * 60), 0);
            setTableWidth(`${totalWidth}px`);
        }
    }, [mainHeaders]);

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        const header = headerRef.current;

        if (!scrollContainer || !header) return;

        const handleScroll = (e) => {
            header.scrollLeft = e.target.scrollLeft;
        };

        scrollContainer.addEventListener('scroll', handleScroll);
        return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }, []);

    const customStyles = {
        head: {
            style: {
                zIndex: 2,
                padding: 0,
                minHeight: '0px',
            },
        },
        headCells: {
            style: {
                backgroundColor: headingBgColor || "#000000",
                color: headingFontColor || "#ffffff",
                textAlign: headingAlignment || 'left',
                fontWeight: "bold",
                padding: "4px 6px",
                borderRight: '1px solid #474646',
                borderBottom: '1px solid #474646',
                minWidth: `${columns?.length > 20 ? "100px" : "60px"} !important`,

            },
        },
        cells: {
            style: {
                padding: "6px 6px",
                 minWidth: `${columns?.length > 20 ? "100px" : "60px"} !important`,
                borderRight: "1px solid #ddd",
            },
        },
        table: {
            style: {
                borderBottom: '1px solid #ccc',
                minWidth: tableWidth,
            },
        },
    };

    const didMountRef = useRef(false);

    const handlePageChange = (page) => {
        if (!didMountRef.current || page === pageNumber) return;
        setPageNumber(page);
    };

    const handleRowsPerPageChange = (size) => {
        if (size === pageSize) return;
        // setPageNumber(1);
        setPageSize(size);
    };

    useEffect(() => {
        didMountRef.current = true;
    }, []);

    return (
        <>
            <div style={{
                position: 'relative',
                width: '100%',
                overflow: 'hidden'
            }}>
                <div
                    ref={scrollContainerRef}
                    style={{
                        overflowX: 'auto',
                        width: '100%',
                        position: 'relative'
                    }}
                >
                    {mainHeaders?.length > 0 &&
                        <div
                            className='first-head'


                        >
                            <div
                                ref={headerRef}
                                className='second-head'

                            >
                                <CustomTableHeading
                                    mainHeaders={mainHeaders}
                                    headingBgColor={headingBgColor}
                                    headingFontColor={headingFontColor}
                                    tableWidth={tableWidth}
                                    columns={columns}
                                    headingAlignment={headingAlignment}
                                />
                            </div>
                        </div>}

                    <DataTable
                        ref={tableRef}
                        persistTableHead={true}
                        dense
                        // columns={columns}
                        columns={columns?.filter(dt => dt?.name !== "Select")?.length > 0 ? columns?.map(col => ({
                            ...col,
                            name: col.title || col.name
                        })) : []}
                        // data={data}
                        data={sortedData}
                        sortServer
                        onSort={handleSort}
                        pagination={pagination}
                        {...(modeOfQuery === "Query" && {
                            paginationServer: true,
                            paginationTotalRows: totalCount,
                            onChangePage: handlePageChange,
                            onChangeRowsPerPage: handleRowsPerPageChange,
                            paginationDefaultPage: pageNumber,
                            paginationResetDefaultPage: false
                        })}
                        // fixedHeader={fixedHeader}
                        fixedHeader={pagination ? false : fixedHeader}
                        fixedHeaderScrollHeight={`${scrollHeight}px`}
                        paginationPerPage={pageSize && modeOfQuery === "Query" ? pageSize : recordsPerPage}
                        paginationRowsPerPageOptions={recordsPerPageOptions}
                        highlightOnHover
                        striped
                        customStyles={customStyles}
                        responsive={false}
                        noTableHead={isTableHeadingRequired}
                        theme={theme === 'Dark' ? 'dark' : 'default'}
                        noDataComponent={columns?.filter(dt => dt?.name !== "Select")?.length > 0 && allTrackData?.length === 0 ?
                            <div className="text-center">
                                <p className="text-center">{'Prepairing data...'}</p>
                                <div className="spinner-border text-primary" role="status">
                                    <span className="sr-only">Loading...</span>
                                </div>
                            </div>
                            : noDataComponent}
                    />
                </div>
            </div>
            <div>
                {!pagination && (
                    <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                        {`Showing 1 to ${data?.length} of ${data?.length} entries`}<br />
                    </div>
                )}
                {(allData?.length > data?.length) && (
                    <div style={{ textAlign: 'right', marginTop: '8px', fontSize: '12px' }}>
                        {`*Records limited to ${limit} out of ${allData?.length}`}<br />
                    </div>
                )}
            </div>
        </>
    );
};

const CustomTableHeading = ({ mainHeaders, headingBgColor, headingFontColor, tableWidth, columns, headingAlignment }) => {
    if (!mainHeaders || mainHeaders.length === 0) return null;

    const isHTML = (str) => {
        const pattern = /<\/?[a-z][\s\S]*>/i;
        return pattern.test(str);
    }

    const stripHtml = (str) => {
        if (!str) return '';
        return str.replace(/<[^>]*>/g, '').trim();
    };

    return (
        <>
            {mainHeaders.map((header, index) => (
                <div
                    key={index}
                    className='third-head'
                    style={{
                        minWidth: `${columns?.length > 20 ? 100 * header?.subHeaders : 60 * header?.subHeaders}px`,
                        width: `${(100 / columns?.length) * header?.subHeaders}%`,
                        borderBottom: header?.isSingle ? 'none' : '1px solid #474646',
                        backgroundColor: headingBgColor || "#000000",
                        color: headingFontColor || "#ffffff",
                        textAlign: headingAlignment || 'left',
                        padding: "6px 6px",
                    }}
                >
                    {isHTML(header?.name?.toString()?.trim()) ?
                        <span dangerouslySetInnerHTML={{ __html: header?.name }} />

                        :
                        <div title={header?.name}>
                            {header?.name}
                        </div>
                    }
                </div >
            ))}
        </>
    );
};

export default Tabular;
import React, { useContext, useEffect, useRef, useState } from 'react'
import { Dropdown } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoginContext } from '../context/LoginContext';
import { useReactToPrint } from 'react-to-print';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileCsv, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import useReportColumns from '../hooks/useReportColumns';
import { ToastAlert } from '../utils/CommonFunction';

const MasterReport = (props) => {

    const { title, column, data, filters } = props;
    const { setIsShowReport, setSelectedOption } = useContext(LoginContext);

    const reportRef = useRef()

    const reportColumns = useReportColumns(column);

    const printReport = useReactToPrint({
        contentRef: reportRef,
        documentTitle: title,
        onAfterPrint: () => { console.log('Report Printed!') }
    })

    //FUNCTION TO DOWNLOAD CSV FILE
    // const downloadCSV = () => {
    //     if (data?.length > 0) {
    //         const filteredData = data.map((row, index) => {
    //             let filteredRow = {};
    //             reportColumns.forEach(col => {
    //                 if (col.name === 'S.No') {
    //                     filteredRow['S.No'] = index + 1;
    //                 } else {
    //                     filteredRow[col.name] = col.selector(row);
    //                 }
    //             });
    //             return filteredRow;
    //         });

    //         const csv = Papa.unparse(filteredData);
    //         const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //         const link = document.createElement('a');
    //         link.href = URL.createObjectURL(blob);
    //         link.setAttribute('download', `${title?.trim()}.csv`);
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } else {
    //         ToastAlert('Data not available to download report', 'warning')
    //     }
    // };


    const downloadCSV = () => {
        if (!data?.length) {
            ToastAlert('Data not available to download report', 'warning');
            return;
        }

        const filterRows = filters
            .filter(f => f?.value)
            .map(f => [`${f.label} : ${f.value}`]);

        const columnHeaders = reportColumns.map(col => col.name);

        const tableRows = data.map((row, index) =>
            reportColumns.map(col =>
                col.name === 'S.No' ? index + 1 : col.selector(row)
            )
        );

        const csvData = [
            [title],
            ...filterRows,
            [],
            columnHeaders,
            ...tableRows
        ];

        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `${title.trim()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    //FUNCTION TO DOWNLOAD PDF FILE

    // const downloadPDF = () => {
    //     if (data?.length > 0) {
    //         const doc = new jsPDF('p', 'mm', 'a4');
    //         const columns = reportColumns.map(col => col.name);
    //         const rows = data.map((row, index) => {
    //             return reportColumns.map(col => {
    //                 if (col.name === 'S.No') {
    //                     return index + 1;
    //                 }
    //                 return col.selector(row);
    //             });
    //         });

    //         doc.autoTable({
    //             head: [columns],
    //             body: rows,
    //             startY: 20,
    //             theme: 'grid',
    //             headStyles: {
    //                 fillColor: [0, 32, 96],
    //                 textColor: [255, 255, 255],
    //                 fontSize: 8
    //             },
    //             bodyStyles: {
    //                 fontSize: 8,
    //             },
    //             styles: {
    //                 cellPadding: 2,
    //                 halign: 'left',
    //             },
    //             margin: { top: 30 },
    //             didDrawPage: () => {
    //                 const pageWidth = doc.internal.pageSize.getWidth();
    //                 doc.setFontSize(14);
    //                 const titleWidth = doc.getTextWidth(title);
    //                 const titleX = (pageWidth - titleWidth) / 2;
    //                 doc.text(title, titleX, 15);

    //                 doc.setFontSize(8);
    //                 const dateText = `Date: ${new Date().toDateString()}`;
    //                 const dateWidth = doc.getTextWidth(dateText);
    //                 doc.text(dateText, pageWidth - dateWidth - 14, 18);

    //                 if (filters.length > 0) {
    //                     let startY = 18;
    //                     const startX = 14;

    //                     filters.forEach(filter => {
    //                         if (filter?.value !== undefined && filter?.value !== '') {
    //                             doc.text(
    //                                 `${filter.label}: ${filter.value}`,
    //                                 startX,
    //                                 startY
    //                             );
    //                             startY += 5; // next line
    //                         }
    //                     });
    //                 }
    //             },

    //         });

    //         doc.save(`${title?.trim()}.pdf`);
    //     } else {
    //         ToastAlert('Data not available to download report', 'warning')
    //     }
    // };


    const loadImage = (src) =>
        new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => resolve(img);
        });


    const downloadPDF = async () => {
        if (!data?.length) {
            ToastAlert('Data not available to download report', 'warning');
            return;
        }

        const doc = new jsPDF('p', 'mm', 'a4');
        const pageWidth = doc.internal.pageSize.getWidth();

        //  Header base positions
        const titleY = 15;
        const dateY = 25;
        const filterStartY = 20;
        const filterLineHeight = 5;

        const validFilters = filters.filter(f => f?.value);

        //  Dynamic table Y (ONLY based on filters)
        const tableStartY =
            validFilters.length > 0
                ? filterStartY + (validFilters.length * filterLineHeight) + 4
                : filterStartY + 6;

        const columns = reportColumns?.map(col => col.name);
        const rows = data?.map((row, index) =>
            reportColumns?.map(col =>
                col?.name === 'S.No' ? index + 1 : col?.selector(row)
            )
        );

        const logo = await loadImage('/dvdms/reportheader.png');

        doc.autoTable({
            head: [columns],
            body: rows,
            startY: tableStartY + 30,
            theme: 'grid',
            margin: { top: 10 },
            headStyles: {
                fillColor: [0, 32, 96],
                textColor: [255, 255, 255],
                fontSize: 8
            },
            bodyStyles: { fontSize: 8 },
            styles: { cellPadding: 2 },

            didDrawPage: (data) => {
                if (data.pageNumber === 1) {

                    const imgWidth = 60;
                    const imgHeight = 35;
                    const imgX = (pageWidth - imgWidth) / 2;
                    const imgY = 5;

                    doc.addImage(logo, 'PNG', imgX, imgY, imgWidth, imgHeight);

                    doc.setFontSize(12);
                    const titleWidth = doc.getTextWidth(title);
                    doc.text(title, pageWidth / 2, imgY + imgHeight + 5, { align: 'center' });

                    doc.setFontSize(10);
                    doc.text("CENTRAL DASHBOARD-DVDMS", pageWidth / 2, imgY + imgHeight + 10, { align: 'center' });

                    doc.setFontSize(9);
                    const dateText = `Date: ${new Date().toDateString()}`;
                    const dateWidth = doc.getTextWidth(dateText);
                    doc.text(dateText, pageWidth - dateWidth - 14, tableStartY + 28);

                    let y = filterStartY;
                    validFilters.forEach(f => {
                        doc.text(`${f.label}: ${f.value}`, 14, y + 35);
                        y += filterLineHeight;
                    });
                }
            }

        });

        doc.save(`${title.trim()}.pdf`);
    };


    const tableCustomStyles = {
        headRow: {
            style: {
                color: '#000000',
                backgroundColor: '#C0D6D6 ',
                outline: '1px solid #000000',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'center',
            },
        }
    };


    return (
        <>
            <div className='masterreport px-2 pt-2 d-flex justify-content-end'>
                <button className='btn btn-primary me-2' onClick={() => { setIsShowReport(false); setSelectedOption([]); }}><i className="fa fa-close me-1" style={{ color: "red", fontSize: "large" }}></i> Cancel</button>
                <Dropdown>
                    <Dropdown.Toggle className='ps-2' variant="primary" id="dropdown-basic">
                        Download Report
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item className='fix-label' href="#" onClick={() => downloadPDF()}>
                            <FontAwesomeIcon icon={faFilePdf} className="me-1" />  Download PDF
                        </Dropdown.Item>

                        <Dropdown.Item className='fix-label' href="#" onClick={() => downloadCSV()}>
                            <FontAwesomeIcon icon={faFileCsv} className="me-1" />  Download CSV
                        </Dropdown.Item>
                        <Dropdown.Item className='fix-label' href="#" onClick={printReport}><i className="fa fa-print me-1"></i> Print Report</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className='datatable-report' ref={reportRef} >
                <div className='mt-2'></div>
                <div className='text-center'>
                    <img className='text-center' src="/dvdms/reportheader.png" alt="img" />
                </div>
                <h6 className='text-center mb-1'><u>{title} Report</u></h6>
                <h6 className='text-center pt-0'>CENTRAL DASHBOARD-DVDMS</h6>

                <div className='text-start me-3' style={{ fontSize: "smaller" }} >
                    {filters?.map((dt, index) => (
                        <React.Fragment key={index}>
                            <span><b>{dt?.label} : </b> {dt?.value}</span><br />
                        </React.Fragment>
                    ))}
                </div>
                <div className='text-end me-3' style={{ fontSize: "smaller" }} >
                    <span><b>Date Of Report : </b>{new Date().toDateString()}</span>
                </div>
                <div className='m-1'>
                    <DataTable
                        dense
                        // fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        columns={reportColumns}
                        data={data}
                        responsive
                        noDataComponent={'There are no data to display'}

                    />
                </div>
            </div>
        </>
    )
}

export default MasterReport

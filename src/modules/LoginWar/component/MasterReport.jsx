import React, { useContext, useRef } from 'react'
import { Dropdown } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useReactToPrint } from 'react-to-print';
// import { csvFile, pdfFile } from '../../utils/svgFiles';
import Papa from 'papaparse';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { LoginContext } from '../context/LoginContext';

const MasterReport = (props) => {

    const { title, column, data } = props;
    const { setIsShowReport, setSelectedOption } = useContext(LoginContext);
    const reportRef = useRef()


    //FUNCTION TO PRINT REPORT
    const printReport = useReactToPrint({
        content: () => reportRef.current,
        documentTitle: 'DataReport',
        onAfterPrint: () => { console.log('Report Printed!') }
    })

    //FUNCTION TO DOWNLOAD CSV FILE
    const downloadCSV = () => {
        const filteredData = data.map((row, index) => {
            let filteredRow = {};
            column.forEach(col => {
                if (col.name === 'S.No') {
                    filteredRow['S.No'] = index + 1;
                } else {
                    filteredRow[col.name] = col.selector(row);
                }
            });
            return filteredRow;
        });

        const csv = Papa.unparse(filteredData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'data-report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };


    //FUNCTION TO DOWNLOAD PDF FILE
    const downloadPDF = () => {
        const doc = new jsPDF('p', 'mm', 'a4');
        const columns = column.map(col => col.name);
        const rows = data.map((row, index) => {
            return column.map(col => {
                if (col.name === 'S.No') {
                    return index + 1;
                }
                return col.selector(row);
            });
        });

        doc.autoTable({
            head: [columns],
            body: rows,
            startY: 20,
            theme: 'grid',
            headStyles: {
                fillColor: [0, 32, 96],
                textColor: [255, 255, 255],
                fontSize: 8
            },
            bodyStyles: {
                fontSize: 8,
            },
            styles: {
                cellPadding: 2,
                halign: 'left',
            },
            margin: { top: 30 },
            didDrawPage: () => {
                const pageWidth = doc.internal.pageSize.getWidth();
                doc.setFontSize(14);
                const titleWidth = doc.getTextWidth(title);
                const titleX = (pageWidth - titleWidth) / 2;
                doc.text(title, titleX, 15);

                doc.setFontSize(8);
                const dateText = `Date: ${new Date().toDateString()}`;
                const dateWidth = doc.getTextWidth(dateText);
                doc.text(dateText, pageWidth - dateWidth - 14, 18);
            },

        });

        doc.save('DataReport.pdf');
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
                        Download
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item className='fix-label' href="#" onClick={downloadPDF}>
                            Download PDF</Dropdown.Item>

                        <Dropdown.Item className='fix-label' href="#" onClick={downloadCSV}>
                            Download CSV
                        </Dropdown.Item>
                        <Dropdown.Item className='fix-label' href="#" onClick={printReport}><i className="fa fa-print me-1"></i> Print Report</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className='datatable-report' ref={reportRef} >
                <div className='mt-4'></div>
                <h6 className='text-center pt-2'><u>{title} Report</u></h6>
                <div className='text-end me-3' style={{ fontSize: "smaller" }} >
                    <span><b>Date Of Report : </b>{new Date().toDateString()}</span>
                </div>
                <div className='m-1'>
                    <DataTable
                        dense
                        // fixedHeader
                        persistTableHead={true}
                        customStyles={tableCustomStyles}
                        columns={column}
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

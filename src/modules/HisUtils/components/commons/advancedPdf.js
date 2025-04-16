import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { fetchLocalLogoAsBase64, fetchLogoAsBase64 } from '../../utils/commonFunction';

export const generatePDF = async (widgetData, tableData, config, filters = []) => {
  if (!widgetData) return;

  const {
    pdfTheme,
    printPDFIn,
    pdfTableFontSize,
    pdfTableheaderBarColor,
    pdfTableheadingFontColour,
    showFilterDetailsInPDF,
    isReportPrintDateRequired,
    isDirectDownloadRequired,
    rptDisplayName,
    isPdfHeaderReqInAllPages
  } = widgetData;

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const logoBase64 = await fetchLocalLogoAsBase64("/pdfIcon.jpeg");

  // Function to draw the header
  const drawHeader = (doc, title) => {

    // if (logoBase64) {
    //   const logoWidth = 15;
    //   const logoHeight = 18;
    //   const logoX = 40;
    //   const logoY = 10;

    //   doc.addImage(logoBase64, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    // }

    if (isLogoRequired) {
      const logoWidth = 15;
      const logoHeight = 18;
      const logoX = 40;
      const logoY = 10;

      doc.addImage(logoImage, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    }

    doc.setFontSize(12);
    doc.setFont('bold');
    // doc.text('Ministry of Health & Family Welfare', pageWidth / 2, 15, { align: 'center' });
    // doc.text('Government of India', pageWidth / 2, 20, { align: 'center' });
    // doc.text('DVDMS Central Dashboard', pageWidth / 2, 25, { align: 'center' });

    doc.text(reportHeader1, pageWidth / 2, 15, { align: headingAlignment.toLowerCase() });
    doc.text(reportHeader2, pageWidth / 2, 20, { align: headingAlignment.toLowerCase() });
    doc.text(reportHeader3, pageWidth / 2, 25, { align: headingAlignment.toLowerCase() });

    // rptDisplayName (Dynamic Title Below Static Header)
    doc.setFontSize(11);
    doc.setFont('bold');
    doc.text(rptDisplayName || 'Report', pageWidth / 2, 35, { align: 'center' });
  };

  // Initial Header Drawing for First Page
  drawHeader(pdf);

  let yPosition = 45;

  // Filters Section
  if (showFilterDetailsInPDF === 'Yes' && filters.length) {
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Filters Applied:', 14, yPosition);
    yPosition += 5;
    filters.forEach((filter) => {
      pdf.text(`${filter.label}: ${filter.value}`, 14, yPosition);
      yPosition += 5;
    });
    yPosition += 5;
  }

  // Prepare headers for autoTable
  const headers = Object.keys(tableData[0] || {}).map((key) => ({
    header: key.toUpperCase(),
    dataKey: key
  }));

  pdf.autoTable({
    startY: yPosition,
    head: [headers.map((h) => h.header)],
    body: tableData.map((row) => headers.map((h) => row[h.dataKey])),
    theme: ['grid', 'striped', 'plain'].includes(pdfTheme) ? pdfTheme : 'striped',
    headStyles: {
      fillColor: pdfTableheaderBarColor || "#000000",
      textColor: pdfTableheadingFontColour || '#ffffff',
      fontSize: parseInt(pdfTableFontSize) || 10
    },
    bodyStyles: {
      fontSize: parseInt(pdfTableFontSize) || 10
    },
    styles: {
      overflow: 'linebreak',
    },
    margin: { top: isPdfHeaderReqInAllPages === 'Yes' ? 50 : 10, left: 5, right: 5 },
    didDrawPage: (data) => {
      const pageNumber = data.pageNumber;

      if (pageNumber === 1 || isPdfHeaderReqInAllPages === 'Yes') {
        drawHeader(pdf);
      }

      // Print Date in Bottom Right Corner (on every page if required)
      if (isReportPrintDateRequired === 'Yes') {
        pdf.setFontSize(10);
        const reportDate = `Print Date: ${new Date().toLocaleDateString()}`;
        const textWidth = pdf.getTextWidth(reportDate);
        pdf.text(reportDate, pageWidth - textWidth - 10, pdf.internal.pageSize.getHeight() - 10);
      }
    }
  });

  if (isDirectDownloadRequired === 'Yes') {
    pdf.save(`${rptDisplayName || 'report'}.pdf`);
  } else {
    pdf.output('dataurlnewwindow');
  }
};


export const generateCSV = (widgetData, tableData, config) => {
  if (!Array.isArray(tableData) || tableData.length === 0) {
    console.warn('No data available to download.');
    return;
  }

  if (!widgetData) return;

  const { rptDisplayName } = widgetData;
  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment } = config;
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

  // const heading = [
  //   ['Ministry of Health Family Welfare'],
  //   ['Government of India'],
  //   ['DVDMS Central Dashboard'],
  //   [rptDisplayName || 'Report Title'],
  //   [],
  //   [],
  //   [`Date: ${currentDate}`],
  //   []
  // ];
  const heading = [
    [reportHeader1],
    [reportHeader2],
    [reportHeader3],
    [rptDisplayName || 'Report Title'],
    [],
    [],
    [`Date: ${currentDate}`],
    []
  ];

  const tableHeaders = Object.keys(tableData[0]);
  const tableRows = tableData.map(row => tableHeaders.map(header => row[header]));

  const finalData = [
    ...heading,
    tableHeaders,
    ...tableRows
  ];

  const csvContent = Papa.unparse(finalData, { skipEmptyLines: false });

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${rptDisplayName || 'report'}.csv`);

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


//FUNCTION TO DOWNLOAD CSV FILE
// export const generateCSV = () => {
//   const filteredData = data.map((row, index) => {
//     let filteredRow = {};
//     column.forEach(col => {
//       if (col.name === 'S.No') {
//         filteredRow['S.No'] = index + 1;
//       } else {
//         filteredRow[col.name] = col.selector(row);
//       }
//     });
//     return filteredRow;
//   });

//   const csv = Papa.unparse(filteredData);
//   const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
//   const link = document.createElement('a');
//   link.href = URL.createObjectURL(blob);
//   link.setAttribute('download', 'data-report.csv');
//   document.body.appendChild(link);
//   link.click();
//   document.body.removeChild(link);
// };

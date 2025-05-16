import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';
import { fetchLocalLogoAsBase64, fetchLogoAsBase64, ToastAlert } from '../../utils/commonFunction';

export const generatePDF1 = async (widgetData, tableData, config, filters = []) => {
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

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();

  // Function to draw the header
  const drawHeader = (doc, title) => {

    if (isLogoRequired) {
      const logoWidth = 15;
      const logoHeight = 18;
      const logoX = 40;
      const logoY = 10;

      doc.addImage(logoImage, 'JPEG', logoX, logoY, logoWidth, logoHeight);
    }

    doc.setFontSize(12);
    doc.setFont('bold');


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

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const drawHeader = (doc) => {
    const logoWidth = 15;
    const logoHeight = 18;
    const margin = 10;
    const textMargin = 10;

    // Handle logos
    if (isLogoRequired === 'Yes' && logos?.length) {
      logos.forEach(logo => {
        if (!logo.image) return;

        let logoX, logoY;

        switch (logo.position.toLowerCase()) {
          case 'top':
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = 5;
            break;
          case 'left':
            logoX = margin;
            logoY = 5;
            break;
          case 'right':
            logoX = pageWidth - logoWidth - margin;
            logoY = 5;
            break;
          default:
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = margin;
        }

        try {
          doc.addImage(logo.image, 'JPEG', logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      });
    }

    // Calculate starting Y position
    const hasTopLogo = isLogoRequired === 'Yes' && logos?.some(logo =>
      logo.position.toLowerCase() === 'top' && logo.image
    );
    const headerYStart = hasTopLogo ? logoHeight + 10 : 15;
    const alignment = headingAlignment.toLowerCase();

    // Determine x-position based on alignment
    let headerX;
    switch (alignment) {
      case 'left':
        headerX = textMargin;
        break;
      case 'right':
        headerX = pageWidth - textMargin;
        break;
      case 'center':
      default:
        headerX = pageWidth / 2;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    doc.text(reportHeader1, headerX, headerYStart, { align: alignment });
    doc.text(reportHeader2, headerX, headerYStart + 5, { align: alignment });
    doc.text(reportHeader3, headerX, headerYStart + 10, { align: alignment });

    doc.setFontSize(11);
    doc.text(rptDisplayName || 'Report', headerX, headerYStart + 17, { align: alignment });


    return headerYStart + 20;
  };

  // drawHeader(pdf);

  const headerEndY = drawHeader(pdf);
  let yPosition = headerEndY + 5;

  // let yPosition = isLogoRequired === 'Yes' && logos.some(logo => logo.position === 'top') ? 45 : 35;

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

export const generateGraphPDF = async (widgetData, tableData, config, filters = []) => {
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
    isPdfHeaderReqInAllPages,
    xAxisLabel,
    yAxisLabel
  } = widgetData;

  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment, logos, logoCounts } = config;

  const orientation = printPDFIn === 'Landscape' ? 'l' : 'p';
  const pdf = new jsPDF(orientation, 'mm', 'a4');

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const drawHeader = (doc) => {
    const logoWidth = 15;
    const logoHeight = 18;
    const margin = 10;
    const textMargin = 10;

    // Handle logos
    if (isLogoRequired === 'Yes' && logos?.length) {
      logos.forEach(logo => {
        if (!logo.image) return;

        let logoX, logoY;

        switch (logo.position.toLowerCase()) {
          case 'top':
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = 5;
            break;
          case 'left':
            logoX = margin;
            logoY = 5;
            break;
          case 'right':
            logoX = pageWidth - logoWidth - margin;
            logoY = 5;
            break;
          default:
            logoX = pageWidth / 2 - logoWidth / 2;
            logoY = margin;
        }

        try {
          doc.addImage(logo.image, 'JPEG', logoX, logoY, logoWidth, logoHeight);
        } catch (error) {
          console.error('Error adding logo:', error);
        }
      });
    }

    // Calculate starting Y position
    const hasTopLogo = isLogoRequired === 'Yes' && logos?.some(logo =>
      logo.position.toLowerCase() === 'top' && logo.image
    );
    const headerYStart = hasTopLogo ? logoHeight + 10 : 15;
    const alignment = headingAlignment.toLowerCase();

    // Determine x-position based on alignment
    let headerX;
    switch (alignment) {
      case 'left':
        headerX = textMargin;
        break;
      case 'right':
        headerX = pageWidth - textMargin;
        break;
      case 'center':
      default:
        headerX = pageWidth / 2;
    }

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');

    doc.text(reportHeader1, headerX, headerYStart, { align: alignment });
    doc.text(reportHeader2, headerX, headerYStart + 5, { align: alignment });
    doc.text(reportHeader3, headerX, headerYStart + 10, { align: alignment });

    doc.setFontSize(11);
    doc.text(rptDisplayName || 'Report', headerX, headerYStart + 17, { align: alignment });


    return headerYStart + 20;
  };

  // drawHeader(pdf);

  const headerEndY = drawHeader(pdf);
  let yPosition = headerEndY + 5;

  // let yPosition = isLogoRequired === 'Yes' && logos.some(logo => logo.position === 'top') ? 45 : 35;

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
  // const headers = Object.keys(tableData[0] || {}).map((key) => ({
  //   header: key.toUpperCase(),
  //   dataKey: key
  // }));

  console.log(tableData, 'tbbb')

  const tabData = [];

  // const headers = ['Category'].concat(tableData.categories.map(series => series.name));
  const body = tableData.seriesData.map((category, index) => {
    const row = [category];
    tableData.seriesData.forEach(series => {
      row.push(series.data[index] || '');
    });
    return row;
  });

  const headers = [xAxisLabel, yAxisLabel];

  // Assuming first series contains the counts
  const counts = tableData.seriesData[0]?.data || [];

  tableData.categories.forEach((state, index) => {
    tabData.push([state, counts[index] || 0]);
  });


  pdf.autoTable({
    startY: yPosition,
    head: [headers],
    body: tabData,
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

  // if (isDirectDownloadRequired === 'Yes') {
    pdf.save(`${rptDisplayName || 'report'}.pdf`);
  // } else {
  //   alert('bb')
  //   pdf.output('dataurlnewwindow');
  // }
};


export const generateCSV = (widgetData, tableData, config) => {
  if (!Array.isArray(tableData) || tableData.length === 0) {
    ToastAlert('No data available to download.', 'warning');
    return;
  }

  if (!widgetData) return;

  const { rptDisplayName} = widgetData;
  const { reportHeader1, reportHeader2, reportHeader3, isLogoRequired, logoImage, headingAlignment } = config;
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

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

export const generateGraphCSV = (widgetData, data, config) => {
  if (!widgetData) return;

  const { rptDisplayName, xAxisLabel,
    yAxisLabel  } = widgetData;
  const { reportHeader1, reportHeader2, reportHeader3 } = config;
  const currentDate = new Date().toLocaleDateString('en-GB') + ' ' + new Date().toLocaleTimeString('en-GB');

  // Prepare heading
  const heading = [
    [reportHeader1],
    [reportHeader2],
    [reportHeader3],
    [rptDisplayName || 'Report Title'],
    [''],
    [''],
    [`Date: ${currentDate}`],
    ['']
  ];

  let csvContent;
  
    // Handle graph data (state-wise facilities)
    if (!data.categories || data.categories.length === 0 || 
        !data.seriesData || data.seriesData.length === 0 || 
        !data.seriesData[0].data) {
      ToastAlert('No graph data available to download.', 'warning');
      return;
    }

    // Simplified headers for state-wise data
    const headers = [xAxisLabel, yAxisLabel];
    
    // Get counts from first series
    const counts = data.seriesData[0].data;
    
    // Prepare rows
    const rows = data.categories.map((state, index) => [
      state, 
      counts[index] || 0
    ]);

    // Combine all data
    const finalData = [
      ...heading,
      headers,
      ...rows
    ];

    csvContent = Papa.unparse(finalData, { 
      skipEmptyLines: false,
      quotes: true
    });

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', `${rptDisplayName || 'report'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Updated PDF generation function that handles both table and graph data


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

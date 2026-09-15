const ExcelJS = require('exceljs');
const PDFDocument = require('pdfkit');

async function exportToExcel(res, columns, rows, sheetName, fileName) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(sheetName || 'Report');
  worksheet.columns = columns;
  worksheet.addRows(rows);
  worksheet.getRow(1).font = { bold: true };
  worksheet.views = [{ state: 'frozen', ySplit: 1 }];
  worksheet.eachRow((row) => {
    row.eachCell((cell) => {
      cell.alignment = { vertical: 'top', wrapText: true };
    });
  });
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  await workbook.xlsx.write(res);
  res.end();
}

function exportToPdf(res, title, columns, rows, fileName) {
  const document = new PDFDocument({ margin: 30, size: 'A4', layout: 'landscape' });
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
  document.pipe(res);
  document.fontSize(16).text(title, { align: 'center' }).moveDown();

  const headers = columns.map((column) => column.header || column.key);
  const keys = columns.map((column) => column.key);
  const pageWidth = document.page.width - document.page.margins.left - document.page.margins.right;
  const columnWidth = pageWidth / Math.max(columns.length, 1);
  const rowHeight = 22;

  const drawRow = (values, bold = false) => {
    const y = document.y;
    document.fontSize(7).font(bold ? 'Helvetica-Bold' : 'Helvetica');
    values.forEach((value, index) => {
      const x = document.page.margins.left + index * columnWidth;
      document.rect(x, y, columnWidth, rowHeight).stroke();
      document.text(String(value ?? ''), x + 3, y + 6, { width: columnWidth - 6, height: rowHeight - 6, ellipsis: true });
    });
    document.y = y + rowHeight;
  };

  drawRow(headers, true);
  rows.forEach((row) => {
    if (document.y + rowHeight > document.page.height - document.page.margins.bottom) {
      document.addPage();
      drawRow(headers, true);
    }
    drawRow(keys.map((key) => row[key]));
  });
  document.end();
}

module.exports = { exportToExcel, exportToPdf };
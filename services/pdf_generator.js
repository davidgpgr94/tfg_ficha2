'use strict'

const PDFDocument = require('../utils/pdf_document_with_tables');
//const PDFDocument = require('pdfkit');
var moment = require('moment');
const DATE_FORMAT = "DD-MM-YYYY"
const TIME_FORMAT = "HH:mm"


var RecordDto = require('../dto/record.dto');

/**
 * 
 * @param {Array<RecordDto>} records List of records to print in the PDF
 * @param {any} dest 
 * @param {Date} from
 * @param {Date} to
 */
async function generatePDF(records, dest, from, to) {
    const doc = new PDFDocument({
        size: 'A4',
        margin: 50,
        info: {
            Title: 'Registros entrada-salida',
            Author: 'Ficha2App'
        },
    });
    if (records.length == 0) {
        doc.font('Helvetica-Bold').fontSize(24).text()
        doc.fontSize(25)
            .text(`Entre las fechas ${moment(from).format(DATE_FORMAT)} y ${moment(to).format(DATE_FORMAT)} no hay registros`, 
                    doc.page.margins.left, 
                    doc.page.height/3, {
                        align: 'justify'
                    }
                );
    } else {
        let rangeStart = moment(from);
        let rangeEnd = moment(to);
        let today = moment(new Date());
        
        // Nombre del empleado - fechas entre las que se muestra - fecha actual
        doc.font('Helvetica').fontSize(10).text(`${records[0].employee.login}`, {lineBreak: false, align: 'left', baseline: 'bottom', oblique: true})
            .font('Helvetica-Bold').fontSize(15).text(`Registros realizados entre ${rangeStart.format(DATE_FORMAT)} y ${rangeEnd.format(DATE_FORMAT)}`, {
                continued: true,
                align: 'center',
                baseline: 'bottom',
                indent: -50
            })
            .font('Helvetica').fontSize(10).text(`${today.format(DATE_FORMAT)}`, {align: 'right', baseline: 'bottom'});
        // Linea horizontal separadora
        doc.rect(45, 55, 505, 1).stroke().moveDown(2);
        // Tabla con dia-entrada-salida de los registros

        let dateOfRecord = records.map(r => moment(r.entry).format(DATE_FORMAT));
        let uniqueDates = dateOfRecord.filter((v, i, ary) => {
            return ary.indexOf(v) === i;
        });

        // uniqueDates.sort((a, b) => moment(a).valueOf() - moment(b).valueOf() ); // Sort it ASC
        const timeZone = moment(records[0].entry).format("Z");
        let table = {headers: ['', `Entrada (UTC ${timeZone})`, `Salida (UTC ${timeZone})`], rows: []};
        uniqueDates.forEach((date, index, ary) => {
            table.headers[0] = date;
            table.rows = [];
            let recordsToPrint = records.filter(r => moment(r.entry).format(DATE_FORMAT) == date);
            recordsToPrint.forEach(r => {
                if (r.exit != undefined) table.rows.push(['', moment(r.entry).format(TIME_FORMAT), moment(r.exit).format(TIME_FORMAT)]);
                else table.rows.push(['', moment(r.entry).format(TIME_FORMAT), '--:--']);
            });
            doc.table(table, {
                prepareHeader: () => doc.font('Helvetica-Bold').fontSize(12),
                prepareRow: (row, i) => doc.font('Helvetica').fontSize(9)
            });
            doc.moveDown(4);
        });
    }
    doc.pipe(dest);
    doc.end();
}

module.exports = {
    generatePDF
}

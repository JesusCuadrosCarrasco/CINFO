const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
const ExcelJS = require('exceljs');

const pdfPaths = [];

// Generar rutas de archivos PDF de forma programática
const startNumber = 9410;
const endNumber = 9741;

for (let i = startNumber; i <= endNumber; i++) {
  const pdfFileName = `000${i}-2023-UAC-CINFO-DGSU-UNMSM.pdf`;
  const pdfPath = path.join('C:/Users/jcuadros/Downloads/CURSOS NUEVOS/certi/CCCAPAC0142-2023-U-4/CERTIFICADOS', pdfFileName);
  pdfPaths.push(pdfPath);
}

// Función para extraer texto de un archivo PDF
async function extractTextFromPDF(pdfPath) {
  const dataBuffer = fs.readFileSync(pdfPath);

  try {
    const data = await pdf(dataBuffer);
    return data.text;
  } catch (error) {
    console.error(`Error al extraer texto del PDF ${pdfPath}:`, error);
    throw error;
  }
}

// Función para copiar el texto de una fila del PDF en el nombre de la copia del PDF
async function copyTextToFilename(pdfPaths) {
  const rutaDestino = 'C:/Users/jcuadros/Downloads/CURSOS NUEVOS/certi/DERECHO CIVIL/CERTIFICADOS_RENOMBRADOS';

  for (let i = 0; i < pdfPaths.length; i++) {
    const pdfPath = pdfPaths[i];
    const textFromPDF = await extractTextFromPDF(pdfPath);

    // Dividir el texto en líneas
    const lines = textFromPDF.split('\n');

    // Inicializar el índice de fila en 0
    let rowIndexForFilename = 0;

    // Iterar hasta encontrar una fila no vacía que no contenga 'UNMSM' para nombreFila
    while (rowIndexForFilename < lines.length && (lines[rowIndexForFilename].trim() === '' || lines[rowIndexForFilename].trim() === 'UNMSM')) {
      rowIndexForFilename++;
    }

    // Verificar si el índice de la fila es válido y si nombreFila no está vacío
    if (rowIndexForFilename < lines.length && lines[rowIndexForFilename].trim() !== '' && lines[rowIndexForFilename].trim() !== 'UNMSM') {
      // Utilizar la fila específica para construir el nombre del archivo
      const nombreFila = lines[rowIndexForFilename].replace(/ /g, '_');
      const nuevoNombre = `${nombreFila} ${path.basename(pdfPath)}`;
      const nuevaRuta = path.join(rutaDestino, nuevoNombre);

      // Utilizar fs para copiar el archivo
      fs.copyFileSync(pdfPath, nuevaRuta);
      console.log(`Copia creada con el nombre ${nuevoNombre}`);
    } else {
      console.error(`No se encontró una fila no vacía que no contenga 'UNMSM' en el PDF ${pdfPath}.`);
    }
  }
}

// Uso de la función
(async () => {
  try {
    await copyTextToFilename(pdfPaths);
  } catch (error) {
    console.error('Error:', error);
  }
})();
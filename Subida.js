const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Declarar el nombre del archivo
const fileName = 'CV-EMEX-2023-I-32';

// Declarar columnas
//3,4,7,5
const usernameColumn = 3; // DOCUMENTO
const nameColumn = 4; // NOMBRES
const emailColumn = 7; // CORREO-1
let firstnameColumn = 5; // Opcional: si firstname está en otra columna (cambiar a let)

// Rutas de los archivos
const excelFilePath = `C:/Users/jcuadros/Downloads/CURSOS NUEVOS/CINFO/LISTAS/${fileName}.xlsx`;
const csvFilePath = `C:/Users/jcuadros/Downloads/CURSOS NUEVOS/CINFO/SUBIDA DE ALUMNOS/${fileName}_Subida.csv`;

// Leer archivo Excel
async function readExcel(filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  // Obtener la primera hoja del libro
  const worksheet = workbook.getWorksheet(1);

  // Obtener los datos de las filas
  const data = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      data.push(row.values);
    }
  });

  return data;
}

// Escribir en el archivo CSV
function writeCSV(csvFilePath, data) {
  const csvWriter = createCsvWriter({
    path: csvFilePath,
    header: [
      { id: 'course1', title: 'course1' },
      { id: 'group1', title: 'group1' },
      { id: 'type1', title: 'type1' },
      { id: 'username', title: 'username' },
      { id: 'lastname', title: 'lastname' },
      { id: 'firstname', title: 'firstname' },
      { id: 'password', title: 'password' },
      { id: 'email', title: 'email' },
    ],
    fieldDelimiter: ';', // Separador de campos
    encoding: 'utf8',
  });

  csvWriter.writeRecords(data).then(() => {
    console.log(`Archivo CSV generado en: ${csvFilePath}`);
  });
}

// Procesar datos
(async () => {
    try {
      const excelData = await readExcel(excelFilePath);
  
      // Procesar los datos y ajustar según sea necesario
      const processedData = excelData.map(row => {
        // Obtener valores de las columnas
        const username = String(row[usernameColumn]);
        const name = row[nameColumn];
        const email = row[emailColumn];
        let firstname = row[firstnameColumn]; // Cambiar a let
        let lastname = '';
  
        // Verificar si hay valor en firstnameColumn
        if (firstnameColumn) {
          if (firstname) {
            // Si firstnameColumn tiene valor, asignar a firstname y name a lastname
            lastname = name;
          } else {
            // Si firstnameColumn tiene valor pero firstname está vacío, dividir name en lastname y firstname
            const nameParts = name.split(' ');
            lastname = nameParts.slice(0, -2).join(' ');
            firstname = nameParts.slice(-2).join(' ');
          }
        } else {
          // Si firstnameColumn no tiene valor, dividir name en lastname y firstname
          const nameParts = name.split(' ');
          lastname = nameParts.slice(0, -2).join(' ');
          firstname = nameParts.slice(-2).join(' ');
        }
  
        // Lógica para username y password
        const paddedUsername = username.padStart(8, '0'); // Asegura que tenga 8 dígitos
        const paddedPassword = paddedUsername; // Puedes ajustar según sea necesario
  
        return {
          course1: fileName,
          group1: 728,
          type1: 1,
          username: paddedUsername,
          lastname: lastname.toUpperCase(),
          firstname: firstname.toUpperCase(),
          password: paddedPassword,
          email: email,
        };
      });
  
      // Escribir en el archivo CSV
      writeCSV(csvFilePath, processedData);
    } catch (error) {
      console.error('Error:', error);
    }
  })();
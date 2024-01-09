//npm install puppeteer
const puppeteer = require('puppeteer');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

(async () => {
  // Iniciar un navegador headless utilizando la nueva implementación

  //No se muestra el navegador
  //const browser = await puppeteer.launch({ headless: 'new' });

  //Se muestra el navegador
  const browser = await puppeteer.launch({ headless: false });

  // Abrir una nueva página
  const page = await browser.newPage();

  try {

    // Solicitar valores al usuario
    const nombreDeUsuario = await prompt('Ingrese el nombre de usuario:');
    const nuevoPassword = nombreDeUsuario; // Repetir el nombre de usuario como nueva contraseña
    const nombre = await prompt('Ingrese el nombre:');
    const apellidos = await prompt('Ingrese el apellido(s):');
    const direccionDeCorreo = await prompt('Ingrese la dirección de correo:');

    // Ir a la página de inicio de sesión
    await page.goto('https://campus.cinfounmsm.edu.pe/login/index.php');

    // Esperar a que aparezca el campo de nombre de usuario
    await page.waitForSelector('#username', { timeout: 60000 }); // Ajusta el tiempo de espera según sea necesario

    // Ingresar el nombre de usuario y la contraseña
    await page.type('#username', '71122396'); // Reemplaza 'tu_usuario' con el nombre de usuario real
    await page.type('#password', '71122396'); // Reemplaza 'tu_contraseña' con la contraseña real

    // Hacer clic en el botón de inicio de sesión
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }), // Ajusta el tiempo de espera según sea necesario
      page.click('#loginbtn'),
    ]);

    //console.log('Inicio de sesión exitoso');

    // Navegar a la URL específica después del inicio de sesión
    await page.goto('https://campus.cinfounmsm.edu.pe/user/editadvanced.php?id=-1');

    // Realizar otras acciones después de llegar a la nueva URL
    //console.log('Formulario de usuario');

    // Llenar los campos del formulario
    await page.type('#id_username', String(nombreDeUsuario));
    await page.type('#id_newpassword', String(nuevoPassword));
    await page.type('#id_firstname', String(nombre));
    await page.type('#id_lastname', String(apellidos));
    await page.type('#id_email', String(direccionDeCorreo));
    
    // Hacer clic en el botón "Crear usuario"
    await page.click('#id_submitbutton');
    
    // Esperar a que la página se actualice o a que se realice una redirección después de hacer clic
    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 60000 }); // Ajusta el tiempo de espera según sea necesario
    
    console.log('Usuario creado exitosamente');


  } catch (error) {
    console.error('Error durante la navegación:', error);
  } finally {
    // Cerrar el navegador
    await browser.close();
  }
})();

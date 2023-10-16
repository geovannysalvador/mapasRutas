const { writeFileSync, mkdirSync } = require('fs');

require('dotenv').config();

// path
const targetPath = './src/environments/environment.ts';
// contenido
const envFileContent = `
export const environment = {
  mapbox_key: "${ process.env['MAPBOX_KEY'] }",
  otra: "Propiedad"
};
`;
// crear archivo
// crea la carpeta
mkdirSync('./src/environments', {recursive:true} );
// crea un archivo
writeFileSync( targetPath, envFileContent );

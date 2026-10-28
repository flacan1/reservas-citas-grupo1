// Servidor estático mínimo (sin dependencias) para servir la app en http://localhost:3000
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = process.env.PORT || 3000;
const CARPETA = path.join(__dirname, 'public');

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.ico': 'image/x-icon',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
};

const servidor = http.createServer((req, res) => {
  let ruta = decodeURIComponent(req.url.split('?')[0]);
  if (ruta === '/') ruta = '/index.html';

  const archivo = path.normalize(path.join(CARPETA, ruta));
  if (!archivo.startsWith(CARPETA)) {
    res.writeHead(403);
    return res.end('Prohibido');
  }

  fs.readFile(archivo, (err, contenido) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('No encontrado');
    }
    const tipo = TIPOS[path.extname(archivo)] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo });
    res.end(contenido);
  });
});

servidor.listen(PUERTO, () => {
  console.log(`Sistema de reservas corriendo en http://localhost:${PUERTO}`);
});

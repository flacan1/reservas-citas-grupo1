# Sistema de Reservas de Citas — Grupo 1

![Pruebas Cypress](https://github.com/flacan1/reservas-citas-grupo1/actions/workflows/cypress.yml/badge.svg)


Proyecto final del curso de **Aseguramiento de la Calidad**. Es una aplicación web hecha desde cero con **HTML, CSS y JavaScript** para agendar, listar y cancelar citas, probada de punta a punta con **Cypress** y ejecutada automáticamente en **GitHub Actions**.

## ¿Qué hace la aplicación?

- **Login** con usuario y contraseña fijos. El panel solo se muestra después de iniciar sesión.
- **Agendar citas** con cliente, fecha y hora.
- **Listar** las citas en una tabla ordenada por fecha y hora, con contador.
- **Cancelar** citas (se quitan de la tabla).
- Los datos se guardan en **localStorage**, así que se conservan al recargar.

### Regla de negocio

**No se permiten dos citas con la misma fecha y hora (traslape).** Si se intenta, aparece el mensaje *"Ya existe una cita para esa fecha y hora"* y la cita no se guarda.

Validaciones adicionales:

| Validación | Mensaje |
|---|---|
| Cliente vacío | El nombre del cliente es obligatorio |
| Cliente con menos de 3 letras | El nombre del cliente debe tener al menos 3 caracteres |
| Fecha vacía | La fecha es obligatoria |
| Hora vacía | La hora es obligatoria |
| Hora fuera de 08:00–17:00 | La hora debe estar dentro del horario de atención (08:00 a 17:00) |

### Credenciales

| Usuario | Contraseña |
|---|---|
| `admin` | `admin123` |

## Cómo ejecutarla

Requisitos: [Node.js](https://nodejs.org/) 18 o superior.

```bash
npm install        # instala Cypress y el reporte
npm start          # levanta la app en http://localhost:3000
```

## Cómo correr las pruebas

Con la app corriendo (`npm start`) en otra terminal:

```bash
npx cypress open   # modo visual, para ver las pruebas paso a paso
npx cypress run    # modo consola; genera video, capturas y reporte
```

O todo en un solo comando (levanta la app, corre las pruebas y la apaga):

```bash
npm test
```

Después de `cypress run` se generan:

- `cypress/videos/` — video de cada archivo de pruebas
- `cypress/screenshots/` — capturas (las de evidencia y las de fallos)
- `cypress/reports/index.html` — reporte HTML de mochawesome

## Pruebas incluidas

| Archivo | Qué prueba |
|---|---|
| `cypress/e2e/login.cy.js` | Login correcto e incorrecto, panel oculto sin sesión, cerrar sesión y 5 credenciales inválidas **guiadas por datos** (`usuarios.json`) |
| `cypress/e2e/citas.cy.js` | Que una cita agendada aparezca en la tabla, que se rechace un horario ocupado (traslape), que cancelar la quite, que el horario quede libre al cancelar y que los datos persistan |
| `cypress/e2e/citas-datos.cy.js` | 9 casos válidos e inválidos **guiados por datos** leídos de `cypress/fixtures/citas.json` con `forEach` |

Para agregar un caso nuevo a las pruebas guiadas por datos solo hay que agregar un objeto a `cypress/fixtures/citas.json`.

## Integración continua (GitHub Actions)

El workflow `.github/workflows/cypress.yml` corre en cada **push** y **pull request**:

1. Instala Node y las dependencias.
2. Levanta la app en `http://localhost:3000`.
3. Ejecuta toda la suite de Cypress.
4. Sube como artefactos (incluso si falla): **videos**, **capturas** y el **reporte mochawesome**.

Se descargan en: pestaña **Actions** → la corrida → sección **Artifacts**.

## Temas de investigación aplicados

1. **Comandos personalizados y caché de sesión** — `cypress/support/commands.js` define `cy.login()` (usa `cy.session` para no repetir el login), `cy.loginUI()` y `cy.agendarCita()`.
2. **Reporte y badge de estado** — `cypress-mochawesome-reporter` genera un reporte HTML con gráficas y capturas; el badge al inicio de este README muestra si el workflow está en verde o en rojo.

## Estructura

```
├── public/                 # la aplicación (HTML, CSS, JS)
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── server.js               # servidor estático en el puerto 3000
├── cypress/
│   ├── e2e/                # pruebas
│   ├── fixtures/           # datos para las pruebas guiadas por datos
│   └── support/            # comandos personalizados
├── cypress.config.js       # baseUrl, video: true, reporter
└── .github/workflows/      # GitHub Actions
```

## Integrantes — Grupo 1

| Nombre | Carné | Rol |
|---|---|---|
| Frank David Lacan Pur | 0908-21-3618 | |
| | | |
| | | |
| | | |

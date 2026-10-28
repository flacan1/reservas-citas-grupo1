# Guía del Grupo 1 — Cómo montar el repositorio y preparar la exposición

Esta guía no es parte del código; es la lista de pasos para que el equipo cumpla lo que pide el docente.

---

## 1. Correr el proyecto en la computadora (Windows)

1. Instalar **Node.js LTS** desde https://nodejs.org (si no lo tienen).
2. Abrir la carpeta `reservas-citas-grupo1` en VS Code → menú *Terminal* → *Nueva terminal*.
3. Ejecutar:
   ```bash
   npm install
   npm start
   ```
4. Abrir http://localhost:3000 → usuario `admin`, contraseña `admin123`.
5. En **otra** terminal: `npx cypress open` → *E2E Testing* → elegir navegador → hacer clic en cada archivo de pruebas.
   O `npx cypress run` para correr todo y generar video, capturas y reporte (`cypress/reports/index.html`).

---

## 2. Crear el repositorio en GitHub (lo hace UN integrante)

1. En GitHub: **New repository** → nombre `reservas-citas-grupo1` → público → *Create* (sin README, ya lo traemos).
2. En la terminal, dentro de la carpeta del proyecto:
   ```bash
   git init
   git add .
   git commit -m "Estructura inicial del sistema de reservas"
   git branch -M main
   git remote add origin https://github.com/flacan1/reservas-citas-grupo1.git
   git push -u origin main
   ```
3. En el repo: **Settings → Collaborators → Add people** → agregar a cada integrante.
4. Editar el `README.md`: cambiar `USUARIO/REPOSITORIO` en el badge y llenar la tabla de integrantes.

> **Importante para la nota del historial:** cada integrante debe tener su `git config user.name` y `user.email` (el mismo correo de su cuenta de GitHub) para que sus commits salgan con su nombre.
> ```bash
> git config --global user.name "Nombre Apellido"
> git config --global user.email "correo@gmail.com"
> ```

---

## 3. Repartir el trabajo en ramas y Pull Requests (mínimo 2 PR)

El proyecto completo ya está en `main` (lo subió Frank). Cada uno hace **un cambio pequeño en su propia rama** y abre su Pull Request, para que todos salgan en el historial:

| Integrante | Rama | Tarea | Revisa |
|---|---|---|---|
| Julio Ticas | `feature/mas-casos-citas` | Agregar 2 casos nuevos a `cypress/fixtures/citas.json` (ver sección 8a) | Frank |
| Daniel Elis | `feature/prueba-contador` | Agregar la prueba "el contador baja al cancelar" en `cypress/e2e/citas.cy.js` (sección 8c) | Ernesto |
| Ernesto Santizo | `docs/readme-ejecucion` | Agregar al README una sección "Problemas comunes" (ej.: si el puerto 3000 está ocupado) | Frank |
| Adrián Pivaral | `demo/rompe-regla` | Corrida en ROJO (sección 5). **Este PR NO se mezcla** | Todos |
| Frank Lacan | — | Aprueba PRs, protección de rama, informe | — |

Pasos de cada uno:
```bash
git checkout main
git pull
git checkout -b feature/pruebas-citas
# copiar/editar sus archivos
git add .
git commit -m "Agrega pruebas de citas y casos guiados por datos"
git push -u origin feature/pruebas-citas
```
En GitHub aparece **Compare & pull request** → crear el PR → otro integrante entra a **Files changed → Review changes → Approve** y deja un comentario → **Merge pull request**.

---

## 4. (Opcional, muy recomendado) Protección de rama

*Settings → Branches → Add branch ruleset / Add rule* para `main`:
- ✅ Require a pull request before merging → 1 aprobación
- ✅ Require status checks to pass → buscar **"Pruebas E2E con Cypress"**

Así, si Cypress queda en rojo, GitHub **no deja hacer merge**. Es la mejor forma de explicar "cómo las pruebas detienen un cambio defectuoso".

---

## 5. Preparar la corrida en VERDE y la corrida en ROJO

**Verde:** cualquier push con el código tal como está.

**Rojo (para demostrar):** crear una rama que rompa la regla de negocio:
```bash
git checkout -b demo/rompe-regla
```
En `public/app.js`, comentar la validación de traslape:
```js
// const ocupado = citas.some((c) => c.fecha === fecha && c.hora === hora);
// if (ocupado) return 'Ya existe una cita para esa fecha y hora';
```
```bash
git commit -am "Demo: quita la validación de traslape"
git push -u origin demo/rompe-regla
```
Abrir un PR → el check se pone en **rojo** porque falla la prueba *"REGLA DE NEGOCIO: rechaza un horario ya ocupado"*. Mostrar el error en Actions, la captura del fallo y el video. **No hacer merge** de este PR.

**Hacer esto ANTES de la exposición** (Actions tarda 2–4 minutos) y dejar las dos corridas listas en pantalla.

---

## 6. Descargar video y capturas

*Actions* → clic en la corrida → abajo, sección **Artifacts** → descargar `cypress-videos`, `cypress-capturas` y `reporte-mochawesome` → descomprimir → mostrar el `.mp4`, los `.png` y abrir `index.html` del reporte.

---

## 7. Guion de la exposición (15 minutos)

| Min | Quién | Qué mostrar |
|---|---|---|
| 0–2 | Frank | Problema, app funcionando, regla de negocio (intentar un traslape en vivo) |
| 2–5 | Julio | Código de las pruebas, fixtures y `forEach` (pruebas guiadas por datos) |
| 5–8 | Adrián | GitHub Actions: corrida verde vs. roja, por qué falló |
| 8–10 | Daniel | Artifacts: video, capturas y reporte mochawesome |
| 10–13 | Ernesto | Temas investigados: `cy.login` + `cy.session`, reporte y badge |
| 13–15 | Todos | Repo: README, historial de commits, PRs con revisión y merge |

---

## 8. Defensa en vivo — modificaciones que pueden pedir

Practiquen estas antes; todas son de 2–5 minutos.

**a) Agregar un caso guiado por datos** (la más fácil): agregar un objeto a `cypress/fixtures/citas.json`:
```json
{ "descripcion": "hora a la medianoche", "cliente": "Diego Paz", "fecha": "2026-11-12",
  "hora": "00:00", "esperado": "invalido",
  "mensaje": "La hora debe estar dentro del horario de atención (08:00 a 17:00)" }
```

**b) Nueva validación: no permitir fines de semana.** En `validarCita` de `public/app.js`, antes de la regla de traslape:
```js
const dia = new Date(fecha + 'T00:00').getDay(); // 0 = domingo, 6 = sábado
if (dia === 0 || dia === 6) return 'No se atiende sábados ni domingos';
```
Y su prueba (el 7 de nov. de 2026 es sábado):
```js
it('rechaza citas en fin de semana', () => {
  cy.agendarCita('Ana López', '2026-11-07', '09:00');
  cy.get('#mensaje').should('have.text', 'No se atiende sábados ni domingos');
});
```
> Ojo: si agregan esta regla, revisen que ninguna fecha de `citas.json` caiga en sábado o domingo.

**c) Nueva prueba: el contador baja al cancelar**, en `citas.cy.js`:
```js
it('el contador baja al cancelar', () => {
  cy.agendarCita('Ana López', '2026-11-10', '09:00');
  cy.get('#contador-citas').should('have.text', '1');
  cy.get('.btn-cancelar').click();
  cy.get('#contador-citas').should('have.text', '0');
});
```

Flujo en vivo: `git checkout -b feature/cambio-en-vivo` → editar → `git commit -am "..."` → `git push -u origin feature/cambio-en-vivo` → abrir PR → mostrar que Actions arranca.

---

## 9. Preguntas probables del docente

- **¿Qué es una prueba guiada por datos?** Una sola prueba que se repite con varios juegos de datos leídos de un archivo (`citas.json`) usando `forEach`. Para agregar un caso no se escribe código, solo se agrega un objeto al JSON.
- **¿Para qué sirve `cy.session`?** Guarda el estado del login (localStorage) la primera vez y lo restaura en las siguientes pruebas, así no se repite el formulario de login en cada `it` y la suite corre más rápido.
- **¿Por qué `if: always()` en el workflow?** Para que los videos y capturas se suban aunque las pruebas fallen; justo cuando falla es cuando más se necesitan.
- **¿Qué pasa si se borra la validación de traslape?** La prueba de la regla de negocio falla, el workflow queda en rojo y, con protección de rama, el PR no se puede mezclar.
- **¿Por qué usan `id` y clases?** Para tener selectores estables; si cambia el diseño, las pruebas no se rompen.
- **¿Dónde se guardan los datos?** En `localStorage` del navegador (claves `reservas_citas` y `reservas_sesion`).

// =====================================================================
// PRUEBAS GUIADAS POR DATOS (obligatorio)
// Cada caso se lee desde cypress/fixtures/citas.json y se repite con forEach.
// Para agregar un caso nuevo solo se agrega un objeto al JSON.
// =====================================================================
import casos from '../fixtures/citas.json';

describe('Agendar citas - casos válidos e inválidos (guiadas por datos)', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  casos.forEach((caso) => {
    it(`[${caso.esperado}] ${caso.descripcion}`, () => {
      cy.agendarCita(caso.cliente, caso.fecha, caso.hora);

      cy.get('#mensaje').should('be.visible').and('have.text', caso.mensaje);

      if (caso.esperado === 'valido') {
        cy.get('#mensaje').should('have.class', 'mensaje-exito');
        cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
        cy.get('#cuerpo-tabla').should('contain', caso.cliente);
      } else {
        cy.get('#mensaje').should('have.class', 'mensaje-error');
        cy.get('#cuerpo-tabla .fila-cita').should('have.length', 0);
      }
    });
  });
});

// =====================================================================
// Pruebas de las CITAS: agendar, regla de traslape y cancelar
// =====================================================================

describe('Gestión de citas', () => {
  beforeEach(() => {
    // Comando personalizado + cy.session: el login se hace una sola vez
    cy.login();
    cy.visit('/');
  });

  it('una cita agendada aparece en la tabla', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');

    cy.get('#mensaje').should('have.text', 'Cita agendada correctamente');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
    cy.get('#cuerpo-tabla .fila-cita')
      .first()
      .within(() => {
        cy.get('.col-cliente').should('have.text', 'Ana López');
        cy.get('.col-fecha').should('have.text', '2026-11-10');
        cy.get('.col-hora').should('have.text', '09:00');
      });
    cy.get('#contador-citas').should('have.text', '1');
    cy.get('#sin-citas').should('not.be.visible');

    // Captura de evidencia (se sube como artefacto en GitHub Actions)
    cy.screenshot('cita-agendada');
  });

  it('REGLA DE NEGOCIO: rechaza un horario ya ocupado (traslape)', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);

    // Otro cliente, misma fecha y hora
    cy.agendarCita('Pedro Ruiz', '2026-11-10', '09:00');

    cy.get('#mensaje')
      .should('be.visible')
      .and('have.class', 'mensaje-error')
      .and('have.text', 'Ya existe una cita para esa fecha y hora');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
    cy.get('#cuerpo-tabla').should('not.contain', 'Pedro Ruiz');

    cy.screenshot('traslape-rechazado');
  });

  it('permite la misma hora en otra fecha (no es traslape)', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.agendarCita('Pedro Ruiz', '2026-11-11', '09:00');

    cy.get('#mensaje').should('have.text', 'Cita agendada correctamente');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 2);
  });

  it('cancelar una cita la quita de la tabla', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.agendarCita('Pedro Ruiz', '2026-11-10', '10:00');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 2);

    cy.contains('#cuerpo-tabla .fila-cita', 'Ana López')
      .find('.btn-cancelar')
      .click();

    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
    cy.get('#cuerpo-tabla').should('not.contain', 'Ana López');
    cy.get('#contador-citas').should('have.text', '1');
  });

  it('al cancelar, el horario vuelve a quedar libre', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.get('.btn-cancelar').click();
    cy.get('#sin-citas').should('be.visible');

    cy.agendarCita('Pedro Ruiz', '2026-11-10', '09:00');
    cy.get('#mensaje').should('have.text', 'Cita agendada correctamente');
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
  });

  it('las citas se conservan al recargar la página (localStorage)', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.reload();
    cy.get('#cuerpo-tabla .fila-cita').should('have.length', 1);
  });

  it('el contador baja al cancelar', () => {
    cy.agendarCita('Ana López', '2026-11-10', '09:00');
    cy.agendarCita('Pedro Ruiz', '2026-11-10', '10:00');
    cy.get('#contador-citas').should('have.text', '2');
    cy.get('.btn-cancelar').first().click();
    cy.get('#contador-citas').should('have.text', '1');
    cy.get('#mensaje').should('have.text', 'Cita cancelada');
  });
});

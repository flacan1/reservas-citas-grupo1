// =====================================================================
// Comandos personalizados (tema de investigación)
// =====================================================================

/**
 * cy.login(usuario, password)
 * Inicia sesión UNA sola vez y la guarda en caché con cy.session.
 * En las siguientes pruebas Cypress restaura el localStorage guardado
 * en lugar de volver a llenar el formulario de login.
 */
Cypress.Commands.add('login', (usuario = 'admin', password = 'admin123') => {
  cy.session(
    ['login', usuario],
    () => {
      cy.visit('/');
      cy.get('#usuario').type(usuario);
      cy.get('#password').type(password, { log: false });
      cy.get('#btn-login').click();
      cy.get('#panel').should('be.visible');
    },
    {
      // Comprueba que la sesión restaurada siga siendo válida
      validate() {
        cy.visit('/');
        cy.get('#panel').should('be.visible');
      },
      cacheAcrossSpecs: true,
    }
  );
});

/**
 * cy.loginUI(usuario, password)
 * Login por la interfaz SIN caché. Se usa en las pruebas del login,
 * donde sí queremos probar el formulario cada vez.
 */
Cypress.Commands.add('loginUI', (usuario, password) => {
  if (usuario) cy.get('#usuario').clear().type(usuario);
  if (password) cy.get('#password').clear().type(password, { log: false });
  cy.get('#btn-login').click();
});

/**
 * cy.agendarCita(cliente, fecha, hora)
 * Llena el formulario y presiona "Agendar".
 * Si un valor viene vacío, el campo se deja vacío (para casos inválidos).
 */
Cypress.Commands.add('agendarCita', (cliente, fecha, hora) => {
  cy.get('#cliente').clear();
  if (cliente) cy.get('#cliente').type(cliente);

  cy.get('#fecha').clear();
  if (fecha) cy.get('#fecha').type(fecha);

  cy.get('#hora').clear();
  if (hora) cy.get('#hora').type(hora);

  cy.get('#btn-agendar').click();
});

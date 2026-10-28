// =====================================================================
// Pruebas del LOGIN
// =====================================================================
import usuarios from '../fixtures/usuarios.json';

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('muestra solo el login si no hay sesión (el panel está oculto)', () => {
    cy.get('#vista-login').should('be.visible');
    cy.get('#panel').should('not.be.visible');
  });

  it('login correcto: muestra el panel', () => {
    cy.loginUI(usuarios.valido.usuario, usuarios.valido.password);

    cy.get('#panel').should('be.visible');
    cy.get('#vista-login').should('not.be.visible');
    cy.get('#usuario-actual').should('contain', 'admin');
  });

  it('login incorrecto: muestra error y no deja entrar', () => {
    cy.loginUI('admin', 'clave-equivocada');

    cy.get('#login-error')
      .should('be.visible')
      .and('have.text', 'Usuario o contraseña incorrectos');
    cy.get('#panel').should('not.be.visible');
  });

  it('cerrar sesión regresa al login', () => {
    cy.loginUI(usuarios.valido.usuario, usuarios.valido.password);
    cy.get('#btn-logout').click();

    cy.get('#vista-login').should('be.visible');
    cy.get('#panel').should('not.be.visible');
  });

  // ---------- PRUEBA GUIADA POR DATOS (forEach sobre el fixture) ----------
  describe('Credenciales inválidas (guiadas por datos desde usuarios.json)', () => {
    usuarios.invalidos.forEach((caso) => {
      it(`rechaza: ${caso.descripcion}`, () => {
        cy.loginUI(caso.usuario, caso.password);

        cy.get('#login-error')
          .should('be.visible')
          .and('have.text', 'Usuario o contraseña incorrectos');
        cy.get('#panel').should('not.be.visible');
      });
    });
  });
});

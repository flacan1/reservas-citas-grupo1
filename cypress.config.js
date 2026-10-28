const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Reporte HTML legible (tema de investigación: mochawesome)
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    reportPageTitle: 'Reporte de pruebas - Sistema de Reservas (Grupo 1)',
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
  },

  video: true,
  screenshotOnRunFailure: true,

  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});

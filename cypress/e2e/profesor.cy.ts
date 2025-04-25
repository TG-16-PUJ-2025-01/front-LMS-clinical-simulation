describe('Teacher flow tests', () => {

  it('PROF-1 Flujo Completo Profe', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('#email').type('profesor@gmail.com');

    cy.get('#password').type('profesor');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/asignaturas');
  });

  it ('PROF-2 Acceso No Autorizado Profesor', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('#email').type('profesor@gmail.com');

    cy.get('#password').type('profesor');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/asignaturas');
  })
});
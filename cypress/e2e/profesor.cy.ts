describe('Teacher flow tests', () => {
  it('Login', () => {
    cy.visit('/');

    cy.wait(1000);

    cy.get('#email').type('profesor@gmail.com');

    cy.get('#password').type('profesor');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/asignaturas');
  });
});
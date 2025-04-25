describe('Teacher flow tests', () => {

  it('PROF-1 Flujo Completo Profe', () => {
    cy.visit('/');

    // TODO: Hace falta paso para ver miembros, guardarlos y que esos miembros sean a los que se les modifica la nota

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

  /*
  / Posibles Nuevos Casos
  / - Verificar que no se permita ingresar una calificacion fuera del rango permitido (menor a 0, mayor a 5)
  / - Intentar crear practica con campos faltantes (o nombre ya existente)
  / - Crear rubrica para otra clase y que no aparezca en la lista de rubricas a asignar
  / - Crear rubrica y asignar a una clase, verificar que aparezca en la lista de rubricas asignadas
  / - Diversos filtros en el menu principal
  / - Modificar reservas y posteriormente editarlas (depronto)
  / - Rubricas, errores y validaciones con respecto a estas
  */
});
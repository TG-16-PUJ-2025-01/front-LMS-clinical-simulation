describe('Teacher flow tests', () => {

  it('PROF-1 Flujo Completo Profe', () => {
    cy.visit('/');

    // TODO: Hace falta paso para ver miembros, guardarlos y que esos miembros sean a los que se les modifica la nota

    cy.wait(1000);

    cy.get('#email').type('profesor@gmail.com');

    cy.get('#password').type('profesor');

    cy.get('button[type="submit"]').click();

    cy.url().should('include', '/profesor/asignaturas');
  });

  it('PROF-2 Acceso No Autorizado Profesor', () => {

    cy.step('Step 1 - Login');
    cy.visit('/');
    cy.wait(1000);
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');

    cy.step('Step 2 - Revisar acceso a clase autorizado');
    cy.visit('/profesor/clases/1/practicas');
    cy.url().should('include', '/profesor/clases/1/practicas');
    cy.get('h1').invoke('text').should('contain', '(20001) Semiología Clínica - 2025-10');

    cy.step('Step 3 - Revisar acceso a clase no autorizado');
    cy.visit('/profesor/clases/3/practicas');
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion

    cy.step('Step 4 - Revisar acceso a practicas autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/clases/1/practicas/1');
    cy.url().should('include', '/profesor/clases/1/practicas/1');
    cy.get('h1').invoke('text').should('contain', 'Practica 1');

    cy.step('Step 5 - Revisar acceso a practicas no autorizadas');
    cy.visit('/profesor/clases/1/practicas/5');
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion

    cy.step('Step 6 - Revisar acceso a listado de calificaciones autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/clases/1/calificaciones');
    cy.url().should('include', '/profesor/clases/1/calificaciones');
    cy.get('h1').invoke('text').should('contain', 'Calificaciones');

    cy.step('Step 7 - Revisar acceso a listado de calificaciones no autorizadas');
    cy.visit('/profesor/clases/3/calificaciones');
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion

    cy.step('Step 8 - Revisar acceso a listado de miembros autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/clases/1/miembros');
    cy.url().should('include', '/profesor/clases/1/miembros');
    cy.get('h1').invoke('text').should('contain', 'Miembros de la Clase');

    cy.step('Step 9 - Revisar acceso a listado de miembros no autorizadas');
    cy.pause();
    cy.visit('/profesor/clases/3/miembros');
    cy.wait(1000);
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion

    cy.step('Step 10 - Revisar acceso a listado de simulaciones autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/simulacion/1');
    cy.url().should('include', '/profesor/simulacion/1');
    cy.get('h1').invoke('text').should('contain', 'Practica 1 (Grupo 1)');

    cy.step('Step 11 - Revisar acceso a listado de simulaciones no autorizadas');
    cy.visit('/profesor/simulacion/16'); // TODO: Revisar si la simulacion 16 existe
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion

    cy.step('Step 12 - Revisar no acceso si no se ha iniciado sesion');
    cy.visit('/profesor/asignaturas');
    cy.url().should('include', '/login');
    // cy.get('h1').invoke('text').should('contain', 'Iniciar Sesión'); TODO arreglar validacion
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
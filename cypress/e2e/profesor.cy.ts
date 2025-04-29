describe('Teacher flow tests', () => {

  // TODO: Hace falta paso para ver miembros, guardarlos y que esos miembros sean a los que se les modifica la nota
  // Reservas
  // TODO: Use practice card lengths instead of hardcoded values
  it.only('PROF-1 Flujo Completo Profe', () => {

    cy.step('Step 1 - Login');
    cy.visit('/');
    cy.wait(2000);
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');

    cy.step('Step 2 - Barra de busqueda');
    cy.get('input[placeholder="Buscar por nombre..."]')
      .should('be.visible')
      .click()
      .type('Fisiopatología Clínica');  
    cy.get('[data-slot="card"]').should('have.length', 1);
    cy.get('[data-slot="card-title"]').should('contain.text', 'Fisiopatología Clínica');

    cy.step('Step 3 - Revisar acceso a clase autorizado');
    cy.get('button[role="combobox"]').contains('Año').click();
    cy.get('div[role="option"][data-value="2025"]').click();
    cy.get('button[role="combobox"]').contains('Periodo').click();
    cy.get('div[role="option"][data-value="30"]').click();
    cy.contains('p', 'No se encontraron clases').should('be.visible');

    cy.step('Step 4 - Resetear Filtros')
    cy.get('button').contains('Resetear Filtros').click();
    cy.get('[data-slot="card"]').should('have.length', 5);

    cy.step('Step 5 - Abrir clase');
    cy.get('[data-slot="card-title"]').contains('Semiología Clínica').click();
    cy.url().should('include', '/profesor/clases/1');
    cy.get('h1').invoke('text').should('contain', '(20001) Semiología Clínica - 2025-10');

    cy.step('Step 6 - Crear Práctica');
    cy.get('button').contains('Crear Práctica').click();
    cy.get('div[role="dialog"]').within(() => {
      cy.get('label[for="name"]').should('contain', 'Nombre');
      cy.get('input#name').should('exist');
    
      cy.get('label[for="description"]').should('contain', 'Descripción');
      cy.get('input#description').should('exist');
    
      cy.get('label[for="type"]').should('contain', 'Tipo');
      cy.get('button[role="combobox"]').should('exist');
    
      cy.get('label[for="gradeable"]').should('contain', 'Evaluación');
      cy.get('button[role="checkbox"]').should('exist');
    
      cy.get('label[for="simulationDuration"]').should('contain', 'Duración Simulación');
      cy.get('input#simulationDuration').should('exist');
    
      cy.get('label[for="numberOfGroups"]').should('contain', 'Número de grupos');
      cy.get('input#numberOfGroups').should('exist');
    
      cy.get('label[for="maxStudentsGroup"]').should('contain', 'Máximo estudiantes por grupo');
      cy.get('input#maxStudentsGroup').should('exist');
    });

    cy.step('Step 7 - Revisar campos con visibilidad condicional');
    cy.get('div[role="dialog"]').within(() => {
      cy.get('button[role="combobox"]').click();  
    });
    cy.get('div[data-radix-popper-content-wrapper]').should('be.visible');
    cy.get('div[role="listbox"]')
      .contains('Individual')
      .click();

    cy.get('div[role="dialog"]').within(() => {
      cy.get('label[for="numberOfGroups"]').should('not.exist');
      cy.get('input#numberOfGroups').should('not.exist');

      cy.get('label[for="maxStudentsGroup"]').should('not.exist');
      cy.get('input#maxStudentsGroup').should('not.exist');
    });

    cy.step('Step 8 - Crear Práctica con campos obligatorios');
    cy.get('input#name').type('Prueba');
    cy.get('input#description').type('Descripción de la prueba');
    cy.get('button[role="combobox"]').click();  
    cy.get('div[data-radix-popper-content-wrapper]').should('be.visible');
    cy.get('div[role="listbox"]')
      .contains('Grupal')
      .click();
    cy.get('button[role="checkbox"]').click();
    cy.get('input#simulationDuration').type('30');
    cy.get('input#numberOfGroups').type('3');
    cy.get('input#maxStudentsGroup').type('3');
    cy.get('button').contains('Guardar').click();
    cy.get('div[role="dialog"]').should('not.exist');

    cy.get('li[data-sonner-toast][data-visible="true"]')
      .should('exist')
      .and('contain.text', 'Práctica creada exitosamente.');

    cy.get('h1').invoke('text').should('contain', '(20001) Semiología Clínica - Prueba');

    cy.step('Step 9 - Editar práctica');
    cy.get('nav')
      .contains('button', 'Volver a la clase')
      .should('be.visible')
      .and('not.be.disabled')
      .click();

    cy.get('[data-slot="card"]')
    .last()
    .within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.contains('Editar')
      .should('be.visible')
      .click();

    cy.get('div[role="dialog"]').within(() => {
      cy.get('input#name').should('exist').clear().type('Prueba Editada');
      cy.get('input#description').should('exist').clear().type('Descripción de la prueba editada');
      cy.get('button').contains('Guardar').click();
    });

    cy.get('li[data-sonner-toast][data-visible="true"]')
      .should('exist')
      .and('contain.text', 'Práctica actualizada exitosamente.');

    cy.get('[data-slot="card"]')
    .last()
    .within(() => {
      cy.get('[data-slot="card-title"]').should('contain.text', 'Prueba Editada');
      cy.get('[data-slot="card-description"]').invoke('text').should('contain', 'Descripción de la prueba editada');
    });

    cy.step('Step 10 - Eliminar práctica');
    cy.get('[data-slot="card"]')
    .last()
    .within(() => {
      cy.get('button[aria-haspopup="menu"]').click();
    });
    cy.contains('Borrar')
      .should('be.visible')
      .click();

    cy.get('button').contains('Eliminar').click();    
    cy.get('li[data-sonner-toast][data-visible="true"]')
      .should('exist')
      .and('contain.text', 'Práctica eliminada exitosamente.');

    cy.step('Step 11 - Abrir práctica');
  });

  it('PROF-2 Acceso No Autorizado Profesor', () => {

    cy.step('Step 1 - Login');
    cy.visit('/');
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');
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
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');

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
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');

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
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');

    cy.step('Step 8 - Revisar acceso a listado de miembros autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/clases/1/miembros');
    cy.url().should('include', '/profesor/clases/1/miembros');
    cy.get('h1').invoke('text').should('contain', 'Miembros de la Clase');

    cy.step('Step 9 - Revisar acceso a listado de miembros no autorizadas');
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/profesor/clases/3/miembros');
    cy.url().should('include', '/login');
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');

    cy.step('Step 10 - Revisar acceso a listado de simulaciones autorizadas');
    cy.get('#email').type('profesor@gmail.com');
    cy.get('#password').type('profesor');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/profesor/asignaturas');
    cy.visit('/profesor/simulacion/1');
    cy.url().should('include', '/profesor/simulacion/1');
    cy.get('h1').invoke('text').should('contain', 'Practica 1 (Grupo 1)');

    cy.step('Step 11 - Revisar acceso a listado de simulaciones no autorizadas');
    cy.visit('/profesor/simulacion/16'); // TODO: Revisar si la simulacion 16 existe (no existe)
    cy.url().should('include', '/login');
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');

    cy.step('Step 12 - Revisar no acceso si no se ha iniciado sesion');
    cy.visit('/profesor/asignaturas');
    cy.url().should('include', '/login');
    cy.get('input#email').should('be.visible').and('have.attr', 'placeholder', 'Correo registrado');
    cy.get('input#password').should('be.visible').and('have.attr', 'placeholder', 'Contraseña');
    cy.get('button[type="submit"]').should('be.visible').and('contain', 'Ingresar');
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
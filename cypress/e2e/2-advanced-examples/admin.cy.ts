describe("Admin flow test", () => {
    it.only("CORD-1 Flujo completo de un coordinador", () => {
        cy.step("Step 1 - Login")
        cy.visit("/")
        cy.wait(2000)
        cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
        cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")
		cy.get("#email").type("admin@gmail.com")
        cy.get("#password").type("admin")
        cy.get('button[type="submit"]').click()
		cy.url().should("include", "/admin/asignaturas")

        cy.step("Step 2 - Probar filtros de asignaturas")
        cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("100003")
        cy.get('table tbody tr').first().within(() => {
            cy.get('td').eq(0).should('contain', '100003'); // ID
            cy.get('td').eq(1).should('contain', 'Cuidados de Enfermería en el Adulto'); // Nombre
            cy.get('td').eq(2).should('contain', 'Mariana Nieto'); // Coordinador
            cy.get('td').eq(3).should('contain', 'cuidados intensivos'); // Departamento
            cy.get('td').eq(4).should('contain', 'pregrado'); // Programa
            cy.get('td').eq(5).should('contain', '3'); // Semestre
          });

        cy.get('table tbody tr').should('have.length', 1);


        cy.get('input[placeholder="Buscar..."]').should("be.visible").click().clear()
        cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("pregrado")
  
          


    })
});
// This file is intentionally left empty. It serves as a placeholder for future tests related to the admin section of the application.
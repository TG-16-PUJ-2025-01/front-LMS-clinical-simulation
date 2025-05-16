describe("Estudiante flow test", () => {
	it.only("CORD-1 Flujo completo de un coordinador", () => {
		cy.step("Step 1 - Login")
		cy.visit("/")
		cy.wait(2000)
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")
		cy.get("#email").type("estudiante@gmail.com")
		cy.get("#password").type("estudiante")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "estudiante/asignaturas")

		cy.step("Step 2 - Probar filtros de MENU DE ESTUDIANTE")

		cy.contains("button", "Año").should("be.visible").click()

		cy.get('input[placeholder="Buscar año..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("2025")

		cy.contains("[cmdk-item]", "2025")
			.should("be.visible") // Asegura que la opción "Felipe" esté visible
			.click()

		cy.get('button[role="combobox"]').should("contain.text", "2025")

		cy.get('[data-slot="card"]').should("have.length", 6)

		cy.get('[data-slot="card"]').each(($card) => {
			cy.wrap($card).find('[data-slot="card-description"]').should("contain.text", "Periodo: 2025")
		})

		cy.contains("button", "Periodo").should("be.visible").click()

		cy.get('input[placeholder="Buscar periodo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("20")

		cy.contains("[cmdk-item]", "20")
			.should("be.visible") // Asegura que la opción "Felipe" esté visible
			.click()

		cy.get('button[role="combobox"]').should("contain.text", "20")

		cy.get('[data-slot="card"]').should("have.length", 0)

		cy.contains("button", "Reiniciar Filtros").should("be.visible").click()

		cy.get('[data-slot="card"]').should("have.length", 6)

		cy.get('input[placeholder="Buscar por nombre..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("cuid")

		cy.get('[data-slot="card"]').each(($card) => {
			cy.wrap($card)
				.find('[data-slot="card-title"]')
				.should("be.visible")
				.should("contain.text", "Cuidados de Enfermería en el Adulto")
		})

		cy.contains("button", "Reiniciar Filtros").should("be.visible").click()

		cy.get('[data-slot="card"]')
			.contains('[data-slot="card-title"]', "Semiología Clínica")
			.should("be.visible")
			.click()

		cy.get('[data-slot="card"]')
			.contains('[data-slot="card-title"]', "Práctica 1")
			.should("be.visible")
			.click()

		cy.contains("button", "Video 2").click()

		cy.get("tbody tr").each(($tr) => {
			cy.wrap($tr)
				.find("td:nth-child(2) p") // selecciona el <p> dentro de la segunda celda
				.should("have.text", "") // verifica que esté vacío
		})

		cy.contains("p.text-blue-javeriana", "La práctica no ha sido calificada").should("exist")

		cy.contains("button", "Ver rúbrica").click()

		cy.get("tbody tr").each(($row, index) => {
			if (index < 3) {
				const expectedText = `Criterio ${index + 1}`
				cy.wrap($row).find("td").eq(0).should("contain.text", expectedText)
			}
		})

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.get("nav")
			.contains("button", "Volver a la clase")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.get('[data-slot="card"]')
			.contains('[data-slot="card-title"]', "Práctica 2")
			.should("be.visible")
			.click()

		cy.contains("p", "El video no está disponible para su visualización").should("exist")

		cy.contains("div", "La práctica no tiene rúbrica asignada").should("exist")

		cy.get("nav")
			.contains("button", "Volver a la clase")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.get('[data-slot="card"]')
			.eq(2) // Tercera card (index 2)
			.find("button") // Busca los botones
			.find("svg.lucide-ellipsis") // Busca el svg dentro del botón
			.should("exist") // Verifica que existe
			.parents("button") // Sube al botón contenedor
			.click() // Hace clic en el botón

		cy.get('[role="menu"]') // Selecciona el contenedor del menú
			.contains("Unirse a Grupo") // Busca el menú item que contiene ese texto
			.click() // Hace clic

		cy.get('input[placeholder="Buscar por número de grupo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("3")

		cy.get("tbody tr")
			.eq(0) // la fila 3 (índice 2 porque empieza en 0)
			.find("td")
			.eq(0) // la primera columna de esa fila
			.should("contain.text", "3")

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.get('[data-slot="card"]')
			.eq(1) // Tercera card (index 2)
			.find("button") // Busca los botones
			.find("svg.lucide-ellipsis") // Busca el svg dentro del botón
			.should("exist") // Verifica que existe
			.parents("button") // Sube al botón contenedor
			.click() // Hace clic en el botón
		
		cy.get('[role="menu"]') // Selecciona el contenedor del menú
			.contains("Unirse a Grupo") // Busca el menú item que contiene ese texto
			.click() // Hace clic
			
		cy.get('input[placeholder="Buscar por número de grupo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("7")
		
		cy.get("tbody tr")
			.eq(0) // la fila 3 (índice 2 porque empieza en 0)
			.find("td")
			.eq(3) // la primera columna de esa fila
			.click() // la primera columna de esa fila
			
		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Inscrito en el grupo")

		cy.get("tbody tr")
			.eq(0) // la fila 3 (índice 2 porque empieza en 0)
			.find("td")
			.eq(3) // la primera columna de esa fila
			.should("contain.text", "Inscrito")

		cy.get('input[placeholder="Buscar por número de grupo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.clear()

	
		cy.get('input[placeholder="Buscar por número de grupo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("7")

		cy.get("tbody tr")
			.eq(0) // la fila 3 (índice 2 porque empieza en 0)
			.find("td")
			.eq(3) // la primera columna de esa fila
			.should("contain.text", "Inscrito")


		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.get("nav")
			.contains("button", "Miembros de la clase")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.get('input[placeholder="Buscar..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("mateo")

		cy.get("table tbody tr")
			.first() // o la fila que quieras
			.find("td")
			.eq(1) // segunda columna
			.should("contain.text", "Mateo")

		cy.get('input[placeholder="Buscar..."]')
			.should("be.visible") // Espera a que el input esté visible
			.clear()
			.type("juan.perez@javeriana.edu.co")

		cy.get("table tbody tr")
			.first() // o la fila que quieras
			.find("td")
			.eq(3) // segunda columna
			.should("contain.text", "juan.perez@javeriana.edu.co")

		cy.get('input[placeholder="Buscar..."]')
			.should("be.visible") // Espera a que el input esté visible
			.clear()
			.type("00000050002")

		cy.get("table tbody tr")
			.first() // o la fila que quieras
			.find("td")
			.eq(0) // segunda columna
			.should("contain.text", "00000050002")

		cy.get("nav")
			.contains("button", "Calificaciones")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.step("Step 8 - Integrarse a un grupo")

		cy.step("Step 8 - Cerrar sesion")

		cy.get("header").find("span.bg-muted").should("be.visible").click()

		cy.contains('div[role="menuitem"]', "Cerrar Sesión").should("be.visible").click()
	})
})
// This file is intentionally left empty. It serves as a placeholder for future tests related to the admin section of the application.

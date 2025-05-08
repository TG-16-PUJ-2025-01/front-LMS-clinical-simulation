describe("Teacher flow tests", () => {
	it.only("PROF-1 Flujo Completo Profe", () => {
		cy.step("Step 1 - Login")
		cy.visit("/")
		cy.wait(2000)
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")

		cy.step("Step 2 - Barra de busqueda")
		cy.get('input[placeholder="Buscar por nombre..."]')
			.should("be.visible")
			.click()
			.type("Fisiopatología Clínica")
		cy.get('[data-slot="card"]').should("have.length", 1)
		cy.get('[data-slot="card-title"]').should("contain.text", "Fisiopatología Clínica")

		cy.step("Step 3 - Revisar acceso a clase autorizado")
		cy.get('button[role="combobox"]').contains("Año").click()
		cy.get('div[role="option"][data-value="2025"]').click()
		cy.get('button[role="combobox"]').contains("Periodo").click()
		cy.get('div[role="option"][data-value="30"]').click()
		cy.contains("p", "No se encontraron clases").should("be.visible")

		cy.step("Step 4 - Reiniciar Filtros")
		cy.get("button").contains("Reiniciar Filtros").click()
		cy.get('[data-slot="card"]').should("have.length", 5)

		cy.step("Step 5 - Abrir clase")
		cy.get('[data-slot="card-title"]').contains("Semiología Clínica").click()
		cy.url().should("include", "/profesor/clases/1")
		cy.get("h1").invoke("text").should("contain", "(20001) Semiología Clínica - 2025-10")

		cy.step("Step 6 - Crear Práctica")
		cy.get("button").contains("Crear Práctica").click()
		cy.get('div[role="dialog"]').within(() => {
			cy.get('label[for="name"]').should("contain", "Nombre")
			cy.get("input#name").should("exist")

			cy.get('label[for="description"]').should("contain", "Descripción")
			cy.get("input#description").should("exist")

			cy.get('label[for="type"]').should("contain", "Tipo")
			cy.get('button[role="combobox"]').should("exist")

			cy.get('label[for="gradeable"]').should("contain", "Evaluación")
			cy.get('button[role="checkbox"]').should("exist")

			cy.get('label[for="simulationDuration"]').should("contain", "Duración Simulación")
			cy.get("input#simulationDuration").should("exist")

			cy.get('label[for="numberOfGroups"]').should("contain", "Número de grupos")
			cy.get("input#numberOfGroups").should("exist")

			cy.get('label[for="maxStudentsGroup"]').should("contain", "Máximo estudiantes por grupo")
			cy.get("input#maxStudentsGroup").should("exist")
		})

		cy.step("Step 7 - Revisar campos con visibilidad condicional")
		cy.get('div[role="dialog"]').within(() => {
			cy.get('button[role="combobox"]').click()
		})
		cy.get("div[data-radix-popper-content-wrapper]").should("be.visible")
		cy.get('div[role="listbox"]').contains("Individual").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get('label[for="numberOfGroups"]').should("not.exist")
			cy.get("input#numberOfGroups").should("not.exist")

			cy.get('label[for="maxStudentsGroup"]').should("not.exist")
			cy.get("input#maxStudentsGroup").should("not.exist")
		})

		cy.step("Step 8 - Crear Práctica con campos obligatorios")
		cy.get("input#name").type("Prueba")
		cy.get("input#description").type("Descripción de la prueba")

		cy.get('button[role="combobox"]').click()
		cy.get("div[data-radix-popper-content-wrapper]").should("be.visible")
		cy.get('div[role="listbox"]').contains("Grupal").click()

		cy.get('button[role="checkbox"]').click()
		cy.get("input#simulationDuration").type("30")
		cy.get("input#numberOfGroups").type("3")
		cy.get("input#maxStudentsGroup").type("3")
		cy.get("button").contains("Guardar").click()
		cy.get('div[role="dialog"]').should("not.exist")

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Práctica creada exitosamente.")

		cy.get("h1").invoke("text").should("contain", "(20001) Semiología Clínica - Prueba")

		cy.step("Step 9 - Crear reservas")
		cy.get("button").contains("Crear Reserva").click()
		cy.get('div[role="dialog"]').within(() => {
			cy.get("h2").invoke("text").should("contain", "Reservar las prácticas")
			cy.contains("No hay reservas en el carrito aún").should("be.visible")
		})

		cy.step("Step 10 - Datos reserva")
		cy.get('div[role="dialog"]').within(() => {
			cy.get("button").contains("Selecciona una fecha").click()
			cy.contains("button", "25").click()
			cy.get("h2").click() // Close date picker
			cy.get("button").contains("Seleccionar hora de inicio").click()
			cy.get('[data-value="10:00"]').click()
			cy.get("h2").click()
			cy.get("button").contains("Seleccionar hora de finalización").click()
			cy.get('[data-value="11:30"]').click()
			cy.get("h2").click() // Close time picker

			cy.get("#react-select-3-placeholder").click({ force: true })
			cy.contains("Consultorio 1").click()

			cy.get("button").contains("Añadir reserva al carrito").click()

			cy.get("div.border.p-2.rounded.h-full.overflow-auto p")
				.should("contain.text", "Sala 1")
				.and("contain.text", "10:00 - 11:30")
		})

		cy.step("Step 11 - Crear reserva y validar exito")
		cy.get("button").contains("Finalizar reserva").click()

		cy.reload()
		cy.get("table tbody tr").should("have.length", 3)

		cy.get("table tbody tr").eq(0).find("td").eq(1).should("contain.text", "10:00")
		cy.get("table tbody tr").eq(0).find("td").eq(2).should("contain.text", "10:30")
		cy.get("table tbody tr").eq(0).find("td").eq(3).should("contain.text", "Pendiente")

		cy.get("table tbody tr").eq(1).find("td").eq(1).should("contain.text", "10:30")
		cy.get("table tbody tr").eq(1).find("td").eq(2).should("contain.text", "11:00")
		cy.get("table tbody tr").eq(1).find("td").eq(3).should("contain.text", "Pendiente")

		cy.get("table tbody tr").eq(2).find("td").eq(1).should("contain.text", "11:00")
		cy.get("table tbody tr").eq(2).find("td").eq(2).should("contain.text", "11:30")
		cy.get("table tbody tr").eq(2).find("td").eq(3).should("contain.text", "Pendiente")

		cy.step("Step 12 - Editar Reserva")

		cy.get("table tbody tr").eq(1).find("button").click()

		cy.contains("Editar Reserva").should("be.visible").click()

		cy.get("button").contains("10:30").click()
		cy.get('[data-value="15:00"]').click()
		cy.get("h2").click() // Close time picker
		cy.get("button").contains("11:00").click()
		cy.get('[data-value="15:30"]').click()

		cy.get("button").contains("Guardar Cambios").click()

		cy.get("li[data-sonner-toast][data-visible='true']")
			.should("exist")
			.and("contain.text", "Reserva actualizada exitosamente")

		cy.get("table tbody tr").eq(1).find("td").eq(1).should("contain.text", "10:30")
		cy.get("table tbody tr").eq(1).find("td").eq(2).should("contain.text", "11:00")
		cy.get("table tbody tr").eq(1).find("td").eq(3).should("contain.text", "Pendiente")

		cy.step("Step 13 - Editar práctica")
		cy.get("nav")
			.contains("button", "Volver a la clase")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.get('[data-slot="card"]')
			.last()
			.within(() => {
				cy.get('button[aria-haspopup="menu"]').click()
			})
		cy.contains("Editar").should("be.visible").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get("input#name").should("exist").clear().type("Prueba Editada")
			cy.get("input#description").should("exist").clear().type("Descripción de la prueba editada")
			cy.get("button").contains("Guardar").click()
		})

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Práctica actualizada exitosamente.")

		cy.get('[data-slot="card"]')
			.last()
			.within(() => {
				cy.get('[data-slot="card-title"]').should("contain.text", "Prueba Editada")
				cy.get('[data-slot="card-description"]')
					.invoke("text")
					.should("contain", "Descripción de la prueba editada")
			})

		cy.step("Step 14 - Eliminar práctica")
		cy.get('[data-slot="card"]')
			.eq(3)
			.within(() => {
				cy.get('button[aria-haspopup="menu"]').click()
			})
		cy.contains("Borrar").should("be.visible").click()

		cy.get("button").contains("Eliminar").click()
		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Práctica eliminada exitosamente")

		cy.step("Step 15 - Abrir práctica")
		cy.get('[data-slot="card-title"]').contains("Práctica 1").click()
		cy.get("h1").invoke("text").should("contain", "Práctica 1")
		cy.get("h1").invoke("text").should("contain", "(20001) Semiología Clínica")
		cy.get("table tbody tr").should("have.length", 3)

		cy.step("Step 16 - Apartado rúbrica")
		cy.get("nav").contains("button", "Rúbricas").should("be.visible").and("not.be.disabled").click()
		cy.get("h1").invoke("text").should("contain", "Rúbricas")
		cy.get("button").contains("Nueva Rúbrica").click()
		cy.get('[role="dialog"]').should("be.visible")
		cy.get('[role="dialog"] h2').invoke("text").should("contain", "Crear Rúbrica")
		cy.get('[role="dialog"] table').should("exist")

		cy.step("Step 17 - Crear rúbrica con campos obligatorios")
		cy.get('input[placeholder="Título"]').type("Mi rúbrica de ejemplo")

		cy.get("div.react-select__placeholder")
			.contains("Seleccionar asignaturas")
			.click({ force: true })

		cy.get('div[role="listbox"]').contains("Semiología Clínica").should("exist").click()

		cy.get("button").contains("+").should("be.visible").click()
		cy.get("button.px-4").contains("+").click()

		cy.get('textarea[name="rubric.criteria.0.name"]').clear().type("Actitud")
		cy.get('textarea[name="rubric.criteria.1.name"]').clear().type("Conocimientos Teóricos")
		cy.get('textarea[name="rubric.criteria.2.name"]').clear().type("Comportamiento")

		cy.get('input[name="rubric.criteria.0.weight"]').clear().type("50")
		cy.get('input[name="rubric.criteria.1.weight"]').clear().type("30")
		cy.get('input[name="rubric.criteria.2.weight"]').clear().type("20")

		cy.get('textarea[name="rubric.criteria.0.scoringScaleDescription.0"]')
			.clear()
			.type("Descripción actualizada 1")
		cy.get('textarea[name="rubric.criteria.1.scoringScaleDescription.0"]')
			.clear()
			.type("Descripción actualizada 2")
		cy.get('textarea[name="rubric.criteria.2.scoringScaleDescription.0"]')
			.clear()
			.type("Descripción actualizada 3")
		cy.get('textarea[name="rubric.criteria.0.scoringScaleDescription.1"]')
			.clear()
			.type("Descripción actualizada 4")
		cy.get('textarea[name="rubric.criteria.1.scoringScaleDescription.1"]')
			.clear()
			.type("Descripción actualizada 5")
		cy.get('textarea[name="rubric.criteria.2.scoringScaleDescription.1"]')
			.clear()
			.type("Descripción actualizada 6")
		cy.get('textarea[name="rubric.criteria.0.scoringScaleDescription.2"]')
			.clear()
			.type("Descripción actualizada 7")
		cy.get('textarea[name="rubric.criteria.1.scoringScaleDescription.2"]')
			.clear()
			.type("Descripción actualizada 8")
		cy.get('textarea[name="rubric.criteria.2.scoringScaleDescription.2"]')
			.clear()
			.type("Descripción actualizada 9")

		cy.get('div[role="dialog"]').within(() => {
			cy.get("thead tr th").eq(2).find("textarea").clear().type("Bajo")

			cy.get("thead tr th").eq(2).find("input").first().clear().type("0")

			cy.get("thead tr th").eq(2).find("input").last().clear().type("3")

			cy.get("thead tr th").eq(3).find("textarea").clear().type("Medio")

			cy.get("thead tr th").eq(3).find("input").first().clear().type("3")

			cy.get("thead tr th").eq(3).find("input").last().clear().type("4")

			cy.get("thead tr th").eq(4).find("textarea").clear().type("Alto")

			cy.get("thead tr th").eq(4).find("input").first().clear().type("4")

			cy.get("thead tr th").eq(4).find("input").last().clear().type("5")

			cy.get("button").contains("Crear").click()
		})

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Rúbrica creada exitosamente")

		cy.get("table tbody tr").should("have.length", 3)

		cy.get("table tbody tr").eq(2).find("td").eq(0).should("contain.text", "Mi rúbrica de ejemplo")

		const today = new Date()
		let formattedDate = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`

		cy.get("table tbody tr").eq(2).find("td").eq(1).should("contain.text", formattedDate)

		cy.step("Step 17 - Ver rúbrica")
		cy.get("table tbody tr").eq(2).find("td").eq(2).find("button").click()

		cy.contains("Ver").should("be.visible").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get("h2").invoke("text").should("contain", "Mi rúbrica de ejemplo")
			cy.get("button").click()
		})

		cy.step("Step 18 - Editar rúbrica")
		cy.get("table tbody tr").eq(2).find("td").eq(2).find("button").click()

		cy.contains("Editar").should("be.visible").click()

		cy.get('input[placeholder="Título"]').clear().type("Rúbrica Modificada")
		cy.get('textarea[name="rubric.criteria.1.name"]').clear().type("Criterio Modificado")
		cy.get('textarea[name="rubric.criteria.1.scoringScaleDescription.0"]')
			.clear()
			.type("Descripción modificada 1")

		cy.get("button").contains("Guardar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Rúbrica actualizada exitosamente")

		cy.get("table tbody tr").eq(2).find("td").eq(0).should("contain.text", "Rúbrica Modificada")

		cy.get("table tbody tr").eq(2).find("td").eq(2).find("button").click()

		cy.contains("Ver").should("be.visible").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get("table tbody tr").eq(1).find("td").eq(0).should("contain.text", "Criterio Modificado")
			cy.get("table tbody tr")
				.eq(1)
				.find("td")
				.eq(1)
				.should("contain.text", "Descripción modificada 1")
			cy.get("h2").invoke("text").should("contain", "Rúbrica Modificada")
			cy.get("button").click()
		})

		cy.step("Step 19 - Archivar rúbrica")
		cy.get("table tbody tr").eq(2).find("td").eq(2).find("button").click()

		cy.contains("Archivar").should("be.visible").click()

		cy.get("button")
			.contains("Archivar")
			.click()
			.then(() => {
				cy.get('li[data-sonner-toast][data-visible="true"]')
					.should("exist")
					.and("contain.text", "Rúbrica archivada exitosamente")
			})

		cy.wait(2000)

		cy.get("table tbody tr").should("have.length", 2)

		cy.step("Step 20 - Ver rúbricas archivada")
		cy.get('button[type="button"][role="radio"][value="archived"]').click({ force: true })

		cy.get("table tbody tr td").eq(0).should("contain.text", "Rúbrica Modificada")

		cy.get("table tbody tr td").eq(1).should("contain.text", formattedDate)

		cy.step("Step 21 - Desarchivar rúbrica")
		cy.get("table tbody tr td").find("button").click()

		cy.contains("Desarchivar").should("be.visible").click()

		cy.get("button")
			.contains("Desarchivar")
			.click()
			.then(() => {
				cy.get('li[data-sonner-toast][data-visible="true"]')
					.should("exist")
					.and("contain.text", "Rúbrica desarchivada exitosamente")
			})

		cy.get('button[type="button"][role="radio"][value="all"]').click({ force: true })

		cy.get("table tbody tr").eq(2).find("td").eq(0).should("contain.text", "Rúbrica Modificada")

		cy.get("table tbody tr").eq(2).find("td").eq(1).should("contain.text", formattedDate)

		cy.step("Step 22 - Calificar simulación")
		cy.visit("/profesor/clases/1/practicas/1")

		cy.get("table tbody tr").eq(0).find("button").click()

		cy.wait(2000)

		cy.contains("Calificar").should("be.visible").click()

		cy.get("section > div.grid > section:nth-child(2) div")
			.invoke("text")
			.should("contain", "La práctica no tiene rúbrica asignada")

		cy.step("Step 23 - Modal de asignar rúbrica")
		cy.get("nav")
			.contains("button", "Volver a la práctica")
			.should("be.visible")
			.and("not.be.disabled")
			.click()
		cy.get("section button").contains("Asignar rúbrica").click()

		cy.step("Step 24 - Asignar rúbrica a práctica")
		cy.get('div[role="dialog"]').within(() => {
			cy.get("h2").invoke("text").should("contain", "Asignar Rúbrica")
			cy.get("button").contains("Guardar").should("be.visible").and("be.disabled")
			cy.get("div > button").contains("Rúbrica Modificada").click()
			cy.get("button").contains("Guardar").click()
		})

		cy.step("Step 25 - Verificar asignación de rúbrica")
		cy.get("table tbody tr").eq(0).find("button").click()

		cy.get("table tbody tr").eq(0).find("td").eq(3).should("contain.text", "Pendiente")

		cy.wait(2000)

		cy.contains("Calificar").should("be.visible").click()

		cy.url().should("include", "profesor/simulacion/1")

		cy.get("h1")
			.invoke("text")
			.should("contain", "(20001) Semiología Clínica - Práctica 1 (Grupo 1)")

		cy.step("Step 26 - Reproducir video de simulación")
		cy.wait(5000)

		cy.get("section > div.grid > section:nth-child(1) textarea")
			.clear()
			.type("Comentario de prueba")
		cy.get("section > div.grid > section:nth-child(1) button").contains("Guardar").click()

		cy.wait(5000)
		cy.get("section > div.grid > section:nth-child(1) textarea")
			.click()
			.clear()
			.type("Segundo comentario de prueba")
		cy.get("section > div.grid > section:nth-child(1) button").contains("Guardar").click()

		cy.get("section > div.grid > section:nth-child(1) > div > div > ul > li")
			.eq(0)
			.invoke("text")
			.should("contain", "Comentario de prueba")
		cy.get("section > div.grid > section:nth-child(1) > div > div > ul > li")
			.eq(1)
			.invoke("text")
			.should("contain", "Segundo comentario de prueba")

		cy.step("Step 27 - Calificar rúbrica")
		cy.get("table tbody tr").eq(0).find("textarea").type("Mal, no lo hiciste bien")
		cy.get("table tbody tr").eq(0).find("input").type("2")

		cy.get("table tbody tr").eq(1).find("textarea").type("Bien hecho, pero puedes mejorar")
		cy.get("table tbody tr").eq(1).find("input").type("4")

		cy.get("table tbody tr").eq(2).find("textarea").type("Excelente, lo hiciste muy bien")
		cy.get("table tbody tr").eq(2).find("input").type("5")

		cy.get("table tbody tr").eq(3).find("textarea").type("En general, bien hecho")

		cy.get("section:nth-child(2)")
			.find("p.text-blue-javeriana.text-right.italic")
			.should("be.visible")
			.and("contain.text", "Sincronizando cambios...")

		cy.wait(7000) // Wait for changes to be automatically saved

		cy.get("section:nth-child(2)")
			.find("p.text-blue-javeriana.text-right.italic")
			.should("be.visible")
			.and("contain.text", "Cambios sincronizados")

		cy.step("Step 28 - Verificar cambios guardados automáticamente")
		cy.reload()
		cy.get("table tbody tr")
			.eq(0)
			.find("textarea")
			.invoke("val")
			.should("eq", "Mal, no lo hiciste bien")
		cy.get("table tbody tr").eq(0).find("input").invoke("val").should("eq", "2")

		cy.get("table tbody tr")
			.eq(1)
			.find("textarea")
			.invoke("val")
			.should("eq", "Bien hecho, pero puedes mejorar")
		cy.get("table tbody tr").eq(1).find("input").invoke("val").should("eq", "4")

		cy.get("table tbody tr")
			.eq(2)
			.find("textarea")
			.invoke("val")
			.should("eq", "Excelente, lo hiciste muy bien")
		cy.get("table tbody tr").eq(2).find("input").invoke("val").should("eq", "5")

		cy.get("table tbody tr")
			.eq(3)
			.find("textarea")
			.invoke("val")
			.should("eq", "En general, bien hecho")

		cy.step("Step 29 - Verificar niveles en rúbrica")
		cy.get("section > div.grid > section:nth-child(2) button").contains("Ver rúbrica").click()

		cy.get('div[role="dialog"]').should("be.visible")

		cy.get('div[role="dialog"] tbody tr')
			.first()
			.within(() => {
				cy.get("td")
					.eq(1)
					.within(() => {
						cy.get("svg").should("exist")
					})
				cy.get("td")
					.eq(2)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
				cy.get("td")
					.eq(3)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
			})

		cy.get('div[role="dialog"] tbody tr')
			.eq(1)
			.within(() => {
				cy.get("td")
					.eq(1)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
				cy.get("td")
					.eq(2)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
				cy.get("td")
					.eq(3)
					.within(() => {
						cy.get("svg").should("exist")
					})
			})

		cy.get('div[role="dialog"] tbody tr')
			.eq(2)
			.within(() => {
				cy.get("td")
					.eq(1)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
				cy.get("td")
					.eq(2)
					.within(() => {
						cy.get("svg").should("not.exist")
					})
				cy.get("td")
					.eq(3)
					.within(() => {
						cy.get("svg").should("exist")
					})
			})

		cy.step("Step 30 - Publicar rúbrica")
		cy.get('div[role="dialog"]').within(() => {
			cy.get("button").click()
		})

		cy.get("section > div.grid > section:nth-child(2) button")
			.contains("Publicar")
			.click()
			.then(() => {
				cy.get('li[data-sonner-toast][data-visible="true"]')
					.should("exist")
					.and("contain.text", "Rúbrica publicada exitosamente")
			})

		cy.step("Step 31 - Verificar publicación de rúbrica")
		cy.get("nav")
			.contains("button", "Volver a la práctica")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		formattedDate = `${today.getDate().toString().padStart(2, "0")}/${(today.getMonth() + 1)
			.toString()
			.padStart(2, "0")}/${today.getFullYear()}`

		cy.get("table tbody tr").eq(0).find("td").eq(3).should("contain.text", "Calificado")
		cy.get("table tbody tr").eq(0).find("td").eq(4).should("contain.text", formattedDate)
		cy.get("table tbody tr").eq(0).find("td").eq(5).should("contain.text", "3.2")

		cy.step("Step 32 - Ver calificaciónes")
		cy.get("nav")
			.contains("button", "Calificaciones")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.get("h1").invoke("text").should("contain", "Calificaciones")

		cy.get("table tbody tr").eq(1).find("td").eq(2).should("contain.text", "3.2")
		cy.get("table tbody tr").eq(4).find("td").eq(2).should("contain.text", "3.2")
		cy.get("table tbody tr").eq(7).find("td").eq(2).should("contain.text", "3.2")

		cy.step("Step 33 - Modificar porcentajes prácticas")
		cy.get("button").contains("Editar porcentajes de calificación").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get("input").eq(0).clear().type("10") // Represents 100%
			cy.get("input").eq(1).clear().type("0")
			cy.get("input").eq(2).clear().type("0")
			cy.get("input").eq(3).clear().type("0")

			cy.get("button").contains("Guardar").click()
		})

		cy.step("Step 34 - Revisión calculo de porcentajes")
		cy.get("table tbody tr").eq(1).find("td").eq(5).should("contain.text", "3.2")
		cy.get("table tbody tr").eq(4).find("td").eq(5).should("contain.text", "3.2")
		cy.get("table tbody tr").eq(7).find("td").eq(5).should("contain.text", "3.2")
	})

	it("PROF-2 Acceso No Autorizado Profesor", () => {
		cy.step("Step 1 - Login")
		cy.visit("/")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")

		cy.step("Step 2 - Revisar acceso a clase autorizado")
		cy.visit("/profesor/clases/1/practicas")
		cy.url().should("include", "/profesor/clases/1/practicas")
		cy.get("h1").invoke("text").should("contain", "(20001) Semiología Clínica - 2025-10")

		cy.step("Step 3 - Revisar acceso a clase no autorizado")
		cy.visit("/profesor/clases/3/practicas")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")

		cy.step("Step 4 - Revisar acceso a practicas autorizadas")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")
		cy.visit("/profesor/clases/1/practicas/1")
		cy.url().should("include", "/profesor/clases/1/practicas/1")
		cy.get("h1").invoke("text").should("contain", "Practica 1")

		cy.step("Step 5 - Revisar acceso a practicas no autorizadas")
		cy.visit("/profesor/clases/1/practicas/5")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")

		cy.step("Step 6 - Revisar acceso a listado de calificaciones autorizadas")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")
		cy.visit("/profesor/clases/1/calificaciones")
		cy.url().should("include", "/profesor/clases/1/calificaciones")
		cy.get("h1").invoke("text").should("contain", "Calificaciones")

		cy.step("Step 7 - Revisar acceso a listado de calificaciones no autorizadas")
		cy.visit("/profesor/clases/3/calificaciones")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")

		cy.step("Step 8 - Revisar acceso a listado de miembros autorizadas")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")
		cy.visit("/profesor/clases/1/miembros")
		cy.url().should("include", "/profesor/clases/1/miembros")
		cy.get("h1").invoke("text").should("contain", "Miembros de la Clase")

		cy.step("Step 9 - Revisar acceso a listado de miembros no autorizadas")
		cy.clearCookies()
		cy.clearLocalStorage()
		cy.visit("/profesor/clases/3/miembros")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")

		cy.step("Step 10 - Revisar acceso a listado de simulaciones autorizadas")
		cy.get("#email").type("profesor@gmail.com")
		cy.get("#password").type("profesor")
		cy.get('button[type="submit"]').click()
		cy.url().should("include", "/profesor/asignaturas")
		cy.visit("/profesor/simulacion/1")
		cy.url().should("include", "/profesor/simulacion/1")
		cy.get("h1").invoke("text").should("contain", "Practica 1 (Grupo 1)")

		cy.step("Step 11 - Revisar acceso a listado de simulaciones no autorizadas")
		cy.visit("/profesor/simulacion/16")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")

		cy.step("Step 12 - Revisar no acceso si no se ha iniciado sesion")
		cy.visit("/profesor/asignaturas")
		cy.url().should("include", "/login")
		cy.get("input#email").should("be.visible").and("have.attr", "placeholder", "Correo registrado")
		cy.get("input#password").should("be.visible").and("have.attr", "placeholder", "Contraseña")
		cy.get('button[type="submit"]').should("be.visible").and("contain", "Ingresar")
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
})

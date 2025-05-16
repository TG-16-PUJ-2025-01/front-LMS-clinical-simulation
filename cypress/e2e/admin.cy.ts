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
		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("td").eq(0).should("contain", "100003") // ID
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("pregr")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(4).invoke("text").should("include", "regrado")
				})
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("farmac")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(3).invoke("text").should("equal", "farmacología")
				})
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').clear()
			})

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("felipe")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(2).invoke("text").should("include", "Felipe")
				})
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').clear()
			})

		cy.step("Step 3 - Probar Crear una asignatura")
		cy.contains("button", "Nueva asignatura").should("be.visible").click()
		cy.get('input[value="0"]').should("be.visible").click().type("10291")

		cy.get('input[placeholder="Nombre"]').should("be.visible").click().type("Anestesiología")
		// Selecciona el coordinador
		cy.contains("button", "Selecciona un coordinador").should("be.visible").click()

		cy.get('input[placeholder="Buscar coordinador..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("Felipe")

		cy.contains("[cmdk-item]", "Felipe")
			.should("be.visible") // Asegura que la opción "Felipe" esté visible
			.click()
		
		cy.get('button[role="combobox"]').should("contain.text", "Felipe")

		// Selecciona el semestre
		cy.contains('button[role="combobox"]', "Semestre").should("be.visible").click()
		cy.get('input[placeholder="Buscar semestre..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("2")
		cy.contains("[cmdk-item]", "2")
			.should("be.visible") // Asegura que la opción "2" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "2")

		// Selecciona la Facultad
		cy.contains('button[role="combobox"]', "Facultad").should("be.visible").click()
		cy.get('input[placeholder="Buscar facultad..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("enf")
		cy.contains("[cmdk-item]", "Enfermería")
			.should("be.visible") // Asegura que la opción "Enfermería" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Enfermería").should("be.visible")

		// Selecciona el Departamento
		cy.contains('button[role="combobox"]', "Departamento").should("be.visible").click()
		cy.get('input[placeholder="Buscar departamento..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("inter")
		cy.get("[cmdk-item]")
			.should("be.visible") // Espera a que las opciones sean visibles
			.contains("Medicina Interna")
			.should("be.visible") // Asegura que la opción "Medicina Interna" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Medicina Interna")

		// Selecciona el Programa
		cy.contains('button[role="combobox"]', "Programa").should("be.visible").click()
		cy.get('input[placeholder="Buscar programa..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("pre")
		cy.contains("[cmdk-item]", "Pregrado")
			.should("be.visible") // Asegura que la opción "Pregrado" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Pregrado")

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Asignatura creada exitosamente")

		cy.step("Step 3 - Probar Editar una asignatura")
		// Encuentra el primer botón con el ícono de los tres puntos suspensivos (...) y haz clic
		cy.get("table tbody tr")
			.first()
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Editar").click()

		//Cambiar la información de la asignatura

		cy.get('input[name="javerianaId"]').should("be.visible").click().clear().type("10291232")

		cy.get('input[name="name"]')
			.should("be.visible")
			.click()
			.clear()
			.type("Anestesiología avanzada")

		cy.contains("label", "Coordinador") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar coordinador..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("Felipe")
		cy.contains("[cmdk-item]", "Felipe")
			.should("be.visible") // Asegura que la opción "Felipe" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Felipe")

		cy.contains("label", "Semestre") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar semestre..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("2")
		cy.contains("[cmdk-item]", "2")
			.should("be.visible") // Asegura que la opción "2" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "2")

		cy.contains("label", "Facultad") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar facultad..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("enf")
		cy.contains("[cmdk-item]", "Enfermería")
			.should("be.visible") // Asegura que la opción "Enfermería" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Enfermería").should("be.visible")

		cy.contains("label", "Departamento") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar departamento..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("inter")
		cy.get("[cmdk-item]")
			.should("be.visible") // Espera a que las opciones sean visibles
			.contains("Medicina Interna")
			.should("be.visible") // Asegura que la opción "Medicina Interna" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Medicina Interna")

		cy.contains("label", "Programa") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar programa..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("pre")
		cy.contains("[cmdk-item]", "Pregrado")
			.should("be.visible") // Asegura que la opción "Pregrado" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Pregrado")

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Asignatura actualizada exitosamente")

		//EVALUAR QUE SE CAMBIO EL NOMBRE DE LA ASIGNATURA
		cy.get('input[placeholder="Buscar..."]')
			.should("be.visible")
			.click()
			.type("Anestesiología avanzada")

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("td").eq(0).should("contain", "10291232") // ID
				cy.get("td").eq(1).should("contain", "Anestesiología avanzada") //
				cy.get("td").eq(2).should("contain", "Felipe") // Coordinador
				cy.get("td").eq(3).should("contain", "Medicina Interna") // Departamento
				cy.get("td").eq(4).should("contain", "Pregrado") // Programa
				cy.get("td").eq(5).should("contain", "2") // Semestre
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 4 - Probar Eliminar una asignatura")

		cy.get("table tbody tr")
			.eq(3)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Asignatura eliminada exitosamente")

		cy.step("Step 5 - Probar Crear una clase")
		cy.get("nav")
			.contains("button", "Listado de clases")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.contains("button", "Nueva clase").should("be.visible").click()

		cy.get('input[placeholder="ID"]').should("not.be.disabled").type("123456") // Para escribir en el input

		cy.contains("label", "Profesor") // Encuentra el label con el texto "Profesor"
			.siblings("div") // Encuentra el div hermano dentro del mismo contenedor
			.should("be.visible") // Verifica que el div sea visible
			.click() // Hace clic en el div

		cy.contains("label", "Profesor") // Encuentra el label con el texto "Profesor"
			.siblings("div") // Selecciona el div hermano
			.find('input[role="combobox"]') // Encuentra el input dentro del div
			.should("be.visible") // Asegura que sea visible
			.type("M{enter}")
			.type("M{enter}") // Escribe en el input

		cy.contains("label", "Asignatura") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar curso..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("humanismo")
		cy.contains("[cmdk-item]", "Ética y Humanismo Médico")
			.should("be.visible") // Asegura que la opción "Pregrado" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Humanismo")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("Año") // Filtra el botón que contiene el texto "Año"
			.should("be.visible") // Verifica que sea visible
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar año..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("2027{enter}")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("2027")
			.should("be.visible")
			.should("contain.text", "2027")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("Periodo") // Filtra el botón que contiene el texto "Año"
			.should("be.visible") // Verifica que sea visible
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar periodo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("20{enter}")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("20")
			.should("be.visible")
			.should("contain.text", "20")

		cy.contains("label", "No. de Participantes") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.type("30") // Hace clic en el botón

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Clase creada exitosamente")

		cy.step("Step 6 - Probar Editar una clase")

		cy.get("table tbody tr")
			.eq(3)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Editar").click()

		cy.get('input[placeholder="ID"]').should("not.be.disabled").type("99967866") // Para escribir en el input

		cy.contains("label", "Asignatura") // Encuentra el label con el texto "Coordinador"
			.siblings("button")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar curso..."]')
			.should("be.visible")
			.clear() // Espera a que el input esté visible
			.type("humanismo")
		cy.contains("[cmdk-item]", "Ética y Humanismo Médico")
			.should("be.visible") // Asegura que la opción "Pregrado" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Humanismo")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("20") // Filtra el botón que contiene el texto "Año"
			.should("be.visible") // Verifica que sea visible
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar año..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("2027{enter}")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("2027")
			.should("be.visible")
			.should("contain.text", "2027")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("10") // Filtra el botón que contiene el texto "Año"
			.should("be.visible") // Verifica que sea visible
			.click() // Hace clic en el botón

		cy.get('input[placeholder="Buscar periodo..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("20{enter}")

		cy.contains("label", "Año y Periodo") // Encuentra el label con el texto "Año y Periodo"
			.siblings("div") // Va al div que contiene los botones
			.find("button") // Encuentra todos los botones dentro del div
			.contains("20")
			.should("be.visible")
			.should("contain.text", "20")

		cy.contains("label", "No. de Participantes") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.type("30") // Hace clic en el botón

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Clase actualizada exitosamente")

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("999678")

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("td").eq(0).should("contain", "99967866") // ID
				cy.get("td").eq(1).should("contain", "Ética y Humanismo Médico") //
				cy.get("td").eq(3).should("contain", "2027-20") // Departamento
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("farma")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(1).invoke("text").should("include", "Farmacología General")
				})
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 7 - Probar Borrar una clase")
		cy.get("nav")
			.contains("button", "Listado de clases")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.wait(500)
		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()
		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Clase eliminada exitosamente")

		cy.step("Step 8 - Probar Descargar plantilla de la clase")
		cy.contains("button", "Descargar plantilla").click()

		cy.get('[role="dialog"]') // Selecciona el modal por el atributo `role="dialog"`
			.contains("button", "Descargar plantilla") // Busca el botón "Descargar plantilla" dentro del modal
			.click() // Hace clic en el botón

		cy.get('[role="dialog"]').should("be.visible")

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.step("Step 9 - Probar Cargar plantilla de la clase para carga masiva")

		cy.contains("button", "Subir Archivo").click()

		cy.get("nav")
			.contains("button", "Listado de clases")
			.should("be.visible")
			.and("not.be.disabled")
			.click()
		cy.step("Step 10 - Probar editar miembros de una clase")

		cy.wait(1000)

		cy.get("table tbody tr")
			.eq(3)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Lista de miembros").click()

		cy.contains("button", "Añadir profesores").click()

		cy.get('div[role="dialog"] input[placeholder="Buscar..."]')
			.should("be.visible")
			.click()
			.type("and")

		cy.get("div.absolute.top-full.left-0.z-20")
			.find("div.cursor-pointer")
			.contains("Andrés Vera")
			.click()

		cy.wait(500)

		cy.get('div[role="dialog"] button').contains("Añadir").click()

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").click().type("Vera")

		cy.wait(500)
		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(4).invoke("text").should("include", "rofesor")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 11 - Probar descargar plantilla de miembros de una clase")

		cy.contains("button", "Descargar plantilla").click()

		cy.get('[role="dialog"]') // Selecciona el modal por el atributo `role="dialog"`
			.contains("button", "Descargar plantilla") // Busca el botón "Descargar plantilla" dentro del modal
			.click() // Hace clic en el botón

		cy.get('[role="dialog"]').should("be.visible")

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.step("Step 12 - Probar eliminar miembros de una clase")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(5)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Miembro eliminado de la clase exitosamente")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(5)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Miembro eliminado de la clase exitosamente")

		cy.get("table tbody tr")
			.eq(1)
			.find("td")
			.eq(5)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Miembro eliminado de la clase exitosamente")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").click().type("pala")

		cy.get("table tbody td").should("contain.text", "No results.")

		cy.get('section input[placeholder="Buscar..."]').clear()

		cy.step("Step 12 - Probar añadir estudiantes a una clase")

		cy.contains("button", "Añadir estudiantes").click()

		cy.get('div[role="dialog"] input[placeholder="Buscar..."]').should("be.visible").clear()

		cy.get('div[role="dialog"] input[placeholder="Buscar..."]')
			.should("be.visible")
			.click()
			.type("jess")

		cy.get("div.absolute.top-full.left-0.z-20")
			.find("div.cursor-pointer")
			.contains("Jessica Palacios")
			.click()

		cy.get('div[role="dialog"] input[placeholder="Buscar..."]').should("be.visible").click().clear()

		cy.get('div[role="dialog"] button').contains("Añadir").click()

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").click().type("pala")

		cy.wait(500)
		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(4).invoke("text").should("include", "studiante")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.get("nav")
			.contains("button", "Listado de cuentas")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.step("Step 13 - Probar cuentas")

		cy.wait(1000)

		cy.contains("button", "Nuevo usuario").should("be.visible").click()

		cy.step("Step 14 - Crear un nuevo usuario con todos los roles")

		cy.get('input[placeholder="ID Institucional"]').should("be.visible").click().type("18293019234")

		cy.get('input[placeholder="Nombre"]').should("be.visible").click().type("María")

		cy.get('input[placeholder="Apellido"]').should("be.visible").click().type("Cárdenas")

		cy.get('input[placeholder="Email"]')
			.should("be.visible")
			.click()
			.type("m_card@javeriana.edu.co")

		cy.contains("label", "Roles") // Encuentra el label con el texto "Profesor"
			.siblings("div") // Selecciona el div hermano
			.find('input[role="combobox"]') // Encuentra el input dentro del div
			.should("be.visible") // Asegura que sea visible
			.type("P{enter}")
			.type("E{enter}")
			.type("A{enter}")
			.type("C{enter}")

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.wait(2000)

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Usuario creado exitosamente")

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("card")

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("td").eq(0).should("contain", "18293019234") // ID
				cy.get("td").eq(1).should("contain", "m_card@javeriana.edu.co") //
				cy.get("td").eq(2).should("contain", "Cárdenas María") // Coordinador
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("rdinador@gmail.com")

		cy.wait(500)

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(1).invoke("text").should("include", "coordinador@gmail.com")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 15 - Borrar cuentas cuentas")

		//felipe remirez
		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()
		cy.contains("button", "Eliminar").click()

		//buscar a felipe para ver que efectivamente se borro

		cy.get('input[placeholder="Buscar..."]').should("be.visible").click().type("mariana")

		cy.get("table tbody td").should("contain.text", "No existen resultados.")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()

		cy.step("Step 16 - Editar cuentas")

		cy.get("table tbody tr")
			.eq(4)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Editar").click()

		cy.get('input[name="name"]').should("be.visible").click().clear().type("Marianela")

		cy.get('input[name="lastName"]').should("be.visible").click().clear().type("García")

		cy.contains("label", "Roles") // Encuentra el label con el texto "Profesor"
			.siblings("div") // Selecciona el div hermano
			.find('input[role="combobox"]') // Encuentra el input dentro del div
			.should("be.visible") // Asegura que sea visible
			.type("E{enter}")
			.type("A{enter}")

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.step("Step 17 -Descargar plantilla de cuentas")

		cy.contains("button", "Descargar plantilla").click()

		cy.get('[role="dialog"]') // Selecciona el modal por el atributo `role="dialog"`
			.contains("button", "Descargar plantilla") // Busca el botón "Descargar plantilla" dentro del modal
			.click() // Hace clic en el botón

		cy.get('[role="dialog"]').should("be.visible")

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.get("nav")
			.contains("button", "Listado de salas")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.step("Step 18 - Probar administración de salas")

		cy.wait(1000)

		cy.step("Step 19 - CREAR SALAS")

		cy.contains("button", "Nueva Sala").should("be.visible").click()

		cy.get('input[placeholder="Nombre"]').should("not.be.disabled").type("sala de partos") // Para escribir en el input

		cy.contains('button[role="combobox"]', "Seleccionar...").should("be.visible").click()
		cy.get('input[placeholder="Buscar tipo de sala..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("Cir")
		cy.get("[cmdk-item]")
			.should("be.visible") // Espera a que las opciones sean visibles
			.contains("Cirugía")
			.should("be.visible") // Asegura que la opción "Medicina Interna" esté visible
			.click()
		cy.get('button[role="combobox"]').should("contain.text", "Cirugía")

		cy.contains("label", "Capacidad") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.type("30") // Hace clic en el botón

		cy.contains("label", "Dirección IP") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.type("10.192.234.23") // Hace clic en el botón

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Sala creada exitosamente")

		cy.step("Step 20 - BUSCAR SALAS")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("partos")

		cy.wait(500)

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(0).invoke("text").should("include", "Sala de partos")
					cy.get("td").eq(1).invoke("text").should("include", "Cirugía")
					cy.get("td").eq(2).invoke("text").should("include", "30")
					cy.get("td").eq(3).invoke("text").should("include", "10.192.234.23")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 21 - EDITAR SALAS")

		cy.get("table tbody tr")
			.eq(4)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Editar").click()

		cy.contains("label", "Nombre") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("sala de genética") // Hace clic en el botón

		cy.contains("label", "Capacidad") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("15") // Hace clic en el botón

		cy.contains("label", "Dirección IP") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("10.123.212.1") // Hace clic en el botón

		cy.contains('button[role="combobox"]', "Cuidado crítico intensivo").should("be.visible").click()
		cy.get('input[placeholder="Buscar tipo de sala..."]')
			.should("be.visible") // Espera a que el input esté visible
			.type("Cir")
		cy.get("[cmdk-item]")
			.should("be.visible") // Espera a que las opciones sean visibles
			.contains("Cirugía")
			.should("be.visible") // Asegura que la opción "Medicina Interna" esté visible
			.click()

		cy.get('button[role="combobox"]').should("contain.text", "Cirugía")

		cy.get('button[type="submit"]').should("be.visible").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Sala actualizada exitosamente")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("genética")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(0).invoke("text").should("include", "Sala de genética")
					cy.get("td").eq(1).invoke("text").should("include", "Cirugía")
					cy.get("td").eq(2).invoke("text").should("include", "15")
					cy.get("td").eq(3).invoke("text").should("include", "10.123.212.1")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 22 - Borrar SALAS")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Sala eliminada exitosamente")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Eliminar").click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Sala eliminada exitosamente")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("2b")

		cy.get("table tbody td").should("contain.text", "Sin resultados.")

		cy.get("nav")
			.contains("button", "Listado de videos")
			.should("be.visible")
			.and("not.be.disabled")
			.click()

		cy.step("Step 23 - Probar administración de videos")

		cy.wait(1000)

		cy.step("Step 25 - BUSCAR VIDEOS")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("103")

		cy.get("table tbody tr")
			.each(($row) => {
				cy.wrap($row).within(() => {
					cy.get("td").eq(0).invoke("text").should("include", "10350-224234500_small")
					cy.get("td").eq(1).invoke("text").should("include", "1/31/2023")
					cy.get("td").eq(2).invoke("text").should("include", "10min")
					cy.get("td").eq(3).invoke("text").should("include", "31.2MB")
				})
			})
			.then(() => {
				cy.get('section input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 26.1 - VER VIDEOS")

		cy.get("table tbody tr")
			.eq(1)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Ver video").click()

		cy.get('div[role="dialog"]').within(() => {
			// Verifica el texto del <p>
			cy.get("p").contains("0350-224234500_small").should("be.visible")

			// Verifica que exista el <video> con el src esperado
			cy.get("video").should("have.attr", "src").and("include", "10350-224234500_small")

			// Luego haces click en el elemento <video>
			cy.get("video").click({ force: true })
		})

		cy.wait(4000)

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		//probar un video que no este disponible

		cy.get("table tbody tr")
			.eq(4)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Ver video").click()

		cy.get('div[role="dialog"]').within(() => {
			cy.get("div.flex.aspect-video")
				.find("p")
				.should("contain.text", "El video no está disponible para su visualización")
		})

		cy.get('[role="dialog"]')
			.find("button")
			.find("svg.lucide-x")
			.should("be.visible") // Asegúrate de que el SVG está visible
			.click()

		cy.step("Step 26.2 - EDITAR VIDEOS")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Editar").click()

		cy.contains("label", "Nombre") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("unavailable_video3") // Hace clic en el botón

		cy.get('button[type="submit"]').click()

		cy.get('li[data-sonner-toast][data-visible="true"]')
			.should("exist")
			.and("contain.text", "Video actualizado")

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("unavailable_video3")

		cy.get("table tbody tr")
			.first()
			.within(() => {
				cy.get("td").eq(0).should("contain", "unavailable_video3") // ID
			})
			.then(() => {
				cy.get('input[placeholder="Buscar..."]').should("be.visible").clear()
			})

		cy.step("Step 27 - BORRAR VIDEOS")

		cy.get("table tbody tr")
			.eq(5)
			.find("td")
			.eq(4)
			.then(($cell) => {
				// Aquí puedes hacer algo con el contenido de la quinta columna si lo necesitas
				cy.log($cell.text()) // Esto solo es para verificar el valor de la celda

				// Ahora, hacemos clic en el botón "..."
				cy.wrap($cell).parents("tr").find("button").click()
			})

		cy.contains("Borrar").click()

		cy.contains("button", "Continuar").click()

		cy.get('section input[placeholder="Buscar..."]').should("be.visible").type("unavailable_video3")

		cy.get("table tbody td").should("contain.text", "No results.")

		cy.step("Step 28 - Probar cambiar contraseña y cerrar sesion")

		/*cy.get("header").find("span.bg-muted").should("be.visible").click()

		cy.contains('div[role="menuitem"]', "Cambiar Contraseña").should("be.visible").click()

		cy.contains("label", "Contraseña Actual") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("admin") // Hace clic en el botón

		cy.contains("label", "Nueva Contraseña") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("Rstz123$") // Hace clic en el botón

		cy.contains("label", "Confirmar Contraseña") // Encuentra el label con el texto "Coordinador"
			.siblings("input")
			.should("be.visible") // Encuentra el botón hermano dentro del mismo div
			.click()
			.clear()
			.type("Rstz123$") // Hace clic en el botón

		cy.contains("button", "Guardar Cambios").click()*/

		cy.get("header").find("span.bg-muted").should("be.visible").click()

		cy.contains('div[role="menuitem"]', "Cerrar Sesión").should("be.visible").click()
	})
})
// This file is intentionally left empty. It serves as a placeholder for future tests related to the admin section of the application.

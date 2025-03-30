import { Navigate, Route, Routes } from "react-router"

import {
	AdminRoute,
	CoordinatorRoute,
	PrivateRoute,
	StudentRoute,
	TeacherRoute,
} from "@/modules/core/config/security/guards"
import Login from "@/modules/shared/auth/layout/LoginLayout"
import AdminCoursesPage from "@/modules/admin/courses/pages/CoursesPage"
import AdminVideosPage from "@/modules/admin/videos/pages/VideosPage"
import AdminClassesPage from "@/modules/admin/classes/pages/ClassesPage"
import AdminRoomsPage from "@/modules/admin/rooms/pages/RoomsPage"
import AdminUsersPage from "@/modules/admin/users/pages/UsersPage"
import CoordinatorSimulationPage from "@/modules/coordinator/simulations/pages/SimulationPage"
import MembersPage from "@/modules/shared/members/pages/MembersPage"
import CoordinatorPracticesPage from "@/modules/coordinator/practices/pages/PracticesPage"
import CoordinatorBookingPage from "@/modules/coordinator/bookings/pages/BookingPage"
import CalendarPage from "@/modules/shared/calendar/pages/CalendarPage"
import CoordinatorCoursesPage from "@/modules/coordinator/courses/pages/coursesPage"
import RubricTemplatePage from "@/modules/coordinator/rubricTemplates/pages/rubricTemplatePage"
import TeacherMainMenuPage from "@/modules/teacher/main-menu/pages/MainMenuPage"
import StudentMainMenuPage from "@/modules/student/main-menu/pages/MainMenuPage"

export default function Router() {
	return (
		<Routes>
			{/* Public Routes */}
			<Route>
				<Route path="/login" element={<Login />} />
			</Route>
			{/* Private Routes */}
			<Route element={<PrivateRoute />}>
				{/* Student Routes */}
				<Route element={<StudentRoute />}>
					<Route path="/estudiante/asignaturas" element={<StudentMainMenuPage />}></Route>

					<Route path="estudiante/calendario" element={<CalendarPage />}></Route>
					<Route path="/estudiante" element={<Navigate to="/estudiante/asignaturas" />}></Route>
					{/*FIXME: Redirect to main page*/}
				</Route>

				{/* Teacher Routes */}
				<Route element={<TeacherRoute />}>
					<Route path="/profesor/asignaturas" element={<TeacherMainMenuPage />}></Route>

					<Route path="/profesor/calendario" element={<CalendarPage />}></Route>
					<Route path="/profesor" element={<Navigate to="/profesor/asignaturas" />}></Route>
					{/*FIXME: Redirect to main page*/}
				</Route>

				{/* Coordinator Routes */}
				<Route element={<CoordinatorRoute />}>
					<Route path="/coordinador" element={<Navigate to="/calendario" />}></Route>
					{/*FIXME: Redirect to main page*/}
					<Route path="/coordinador/calendario" element={<CalendarPage />}></Route>
					<Route path="/coordinador/simulacion/:id" element={<CoordinatorSimulationPage />}></Route>
					<Route path="/coordinador/asignaturas" element={<CoordinatorCoursesPage />}></Route>
					<Route path="/coordinador/practica/:id" element={<CoordinatorBookingPage />}></Route>
					<Route
						path="/coordinador/clases/:id/practicas"
						element={<CoordinatorPracticesPage />}
					></Route>
					<Route path="/coordinador/clases/:id/miembros" element={<MembersPage />}></Route>
					<Route path="/coordinador/practicas" element={<CoordinatorPracticesPage />}></Route>
					<Route path="/coordinador/rubricas" element={<RubricTemplatePage />}></Route>
				</Route>

				{/* Admin Routes */}
				<Route element={<AdminRoute />}>
					<Route path="/admin" element={<Navigate to="/admin/asignaturas" />}></Route>
					<Route path="/admin/asignaturas" element={<AdminCoursesPage />}></Route>
					<Route path="/admin/videos" element={<AdminVideosPage />}></Route>
					<Route path="/admin/clases" element={<AdminClassesPage />}></Route>
					<Route path="/admin/salas" element={<AdminRoomsPage />}></Route>
					<Route path="/admin/usuarios" element={<AdminUsersPage />}></Route>
					<Route path="/admin/clases/:id/miembros" element={<MembersPage />}></Route>
				</Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

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
import AdminCalendarPage from "@/modules/admin/calendar/pages/CalendarPage"
import CoordinatorSimulationPage from "@/modules/coordinator/simulations/pages/SimulationPage"
import CoordinatorPracticesPage from "@/modules/coordinator/practices/pages/PracticesPage"
import CoordinatorMembersPage from "@/modules/coordinator/members/pages/MembersPage"
import CoordinatorBookingPage from "@/modules/coordinator/bookings/pages/BookingPage"
import CoordinatorCalendarPage from "@/modules/coordinator/calendar/pages/CalendarPage"
import CoordinatorCoursesPage from "@/modules/coordinator/courses/pages/coursesPage"
import CoordinatorGradesPage from "@/modules/coordinator/grades/pages/GradesPage"
import TeacherSimulationPage from "@/modules/teacher/simulations/pages/SimulationPage"
import TeacherMainMenuPage from "@/modules/teacher/main-menu/pages/MainMenuPage"
import TeacherPracticesPage from "@/modules/teacher/practices/pages/PracticesPage"
import TeacherBookingPage from "@/modules/teacher/bookings/pages/BookingPage"
import TeacherCalendarPage from "@/modules/teacher/calendar/pages/CalendarPage"
import TeacherMembersPage from "@/modules/teacher/members/pages/MembersPage"
import TeacherGradesPage from "@/modules/teacher/grades/pages/GradesPage"
import StudentMainMenuPage from "@/modules/student/main-menu/pages/MainMenuPage"
import StudentPracticesPage from "@/modules/student/practices/pages/PracticesPage"
import StudentCalendarPage from "@/modules/student/calendar/pages/CalendarPage"
import StudentMembersPage from "@/modules/student/members/pages/MembersPage"
import StudentGradesPage from "@/modules/student/grades/pages/GradesPage"
import MembersPage from "@/modules/shared/members/pages/MembersPage"
import CoordinatorRubricTemplatePage from "@/modules/coordinator/rubricTemplates/pages/rubricTemplatePage"
import TeacherRubricTemplatePage from "@/modules/teacher/rubricTemplates/pages/RubricTemplatePage"


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

					<Route path="/estudiante/clases/:id/practicas" element={<StudentPracticesPage />}></Route>
					<Route path="/estudiante" element={<Navigate to="/estudiante/asignaturas" />}></Route>
					<Route path="/estudiante/calendario" element={<StudentCalendarPage />}></Route>
					<Route path="/estudiante/clases/:id/miembros" element={<StudentMembersPage />}></Route>
					<Route path="/estudiante/clases/:classId/calificaciones" element={<StudentGradesPage />}></Route>
					{/*FIXME: Redirect to main page*/}
				</Route>

				{/* Teacher Routes */}
				<Route element={<TeacherRoute />}>
					<Route path="/profesor/asignaturas" element={<TeacherMainMenuPage />}></Route>

					<Route path="/profesor/calendario" element={<TeacherCalendarPage />}></Route>
					<Route path="/profesor/clases/:id/practicas" element={<TeacherPracticesPage />}></Route>
					<Route
						path="/profesor/clases/:classId/practicas/:practiceId"
						element={<TeacherBookingPage />}
					></Route>
					<Route path="/profesor" element={<Navigate to="/profesor/asignaturas" />}></Route>
					<Route path="/profesor/clases/:id/miembros" element={<TeacherMembersPage />}></Route>
					<Route path="/profesor/clases/:classId/calificaciones" element={<TeacherGradesPage />}></Route>
					<Route path="/profesor/simulacion/:id" element={<TeacherSimulationPage />}></Route>
					<Route path="/profesor/rubricas" element={<TeacherRubricTemplatePage />}></Route>
				</Route>

				{/* Coordinator Routes */}
				<Route element={<CoordinatorRoute />}>
					<Route path="/coordinador" element={<Navigate to="/coordinador/asignaturas" />}></Route>
					<Route path="/coordinador/calendario" element={<CoordinatorCalendarPage />}></Route>
					<Route path="/coordinador/simulacion/:id" element={<CoordinatorSimulationPage />}></Route>
					<Route path="/coordinador/asignaturas" element={<CoordinatorCoursesPage />}></Route>
					<Route
						path="/coordinador/clases/:classId/practicas/:practiceId"
						element={<CoordinatorBookingPage />}
					></Route>
					<Route
						path="/coordinador/clases/:id/practicas"
						element={<CoordinatorPracticesPage />}
					></Route>
					<Route
						path="/coordinador/clases/:id/miembros"
						element={<CoordinatorMembersPage />}
					></Route>
					<Route path="/coordinador/practicas" element={<CoordinatorPracticesPage />}></Route>
					<Route path="/coordinador/rubricas" element={<CoordinatorRubricTemplatePage />}></Route>
					<Route
						path="/coordinador/clases/:classId/calificaciones"
						element={<CoordinatorGradesPage />}
					></Route>
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
					<Route path="/admin/calendario" element={<AdminCalendarPage />}></Route>
				</Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

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
				<Route element={<StudentRoute />}></Route>

				{/* Teacher Routes */}
				<Route element={<TeacherRoute />}></Route>

				{/* Coordinator Routes */}
				<Route element={<CoordinatorRoute />}>
					<Route path="/coordinator/simulation/:id" element={<CoordinatorSimulationPage />}></Route>
				</Route>

				{/* Admin Routes */}
				<Route element={<AdminRoute />}>
					<Route path="/admin/asignaturas" element={<AdminCoursesPage />}></Route>
					<Route path="/admin/videos" element={<AdminVideosPage />}></Route>
					<Route path="/admin/clases" element={<AdminClassesPage />}></Route>
					<Route path="/admin/salas" element={<AdminRoomsPage />}></Route>
					<Route path="/admin/usuarios" element={<AdminUsersPage />}></Route>
				</Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

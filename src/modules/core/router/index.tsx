import { Navigate, Route, Routes } from "react-router"

import {
	AdminRoute,
	CoordinatorRoute,
	PrivateRoute,
	StudentRoute,
	TeacherRoute,
} from "@/modules/core/config/security/guards"
import Login from "@/modules/shared/auth/pages/Login/Login"
import CoursesPage from "@/modules/admin/courses/pages/CoursesPage"
import VideosPage from "@/modules/admin/videos/pages/VideosPage"
import ClassesPage from "@/modules/admin/classes/pages/ClassesPage"

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
				<Route element={<CoordinatorRoute />}></Route>

				{/* Admin Routes */}
				<Route element={<AdminRoute />}>
					<Route path="/admin/materias" element={<CoursesPage />}></Route>
					<Route path="/admin/videos" element={<VideosPage />}></Route>
					<Route path="/admin/clases" element={<ClassesPage />}></Route>
				</Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

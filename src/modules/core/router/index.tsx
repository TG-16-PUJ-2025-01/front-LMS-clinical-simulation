import { Navigate, Route, Routes } from "react-router"

import {
	AdminRoute,
	CoordinatorRoute,
	PrivateRoute,
	StudentRoute,
	TeacherRoute,
} from "@/modules/core/config/security/guards"
import Login from "@/modules/shared/auth/pages/Login/Login"
import Courses from "@/modules/admin/courses/pages/Courses"
import Videos from "@/modules/admin/courses/pages/Videos"

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
					<Route path="/admin" element={<Courses />}></Route>
					<Route path="/admin/videos" element={<Videos />}></Route>
				</Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

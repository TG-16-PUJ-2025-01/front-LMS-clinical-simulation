import { Navigate, Route, Routes } from "react-router"

import {
	AdminRoute,
	CoordinatorRoute,
	PrivateRoute,
	StudentRoute,
	TeacherRoute,
} from "@/modules/core/config/security/guards"
import Login from "@/modules/shared/auth/pages/Login/Login"

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
				<Route element={<AdminRoute />}></Route>

				{/* Default Route */}
				<Route path="*" element={<Navigate to="/login" />}></Route>
			</Route>
		</Routes>
	)
}

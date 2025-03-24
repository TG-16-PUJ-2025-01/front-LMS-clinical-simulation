import { Navigate, Outlet } from "react-router-dom"

import AdminLayout from "@/modules/admin/layout/AdminLayout"
import CoordinatorLayout from "@/modules/coordinator/layout/CoordinatorLayout"
import StudentLayout from "@/modules/student/layout/StudentLayout"
import TeacherLayout from "@/modules/teacher/layout/TeacherLayout"
import { LayoutSlotProvider } from "../../components/Slots/LayoutSlotContext"
import { isValidToken, getRolesByToken } from "@/modules/shared/auth/services/authService"
import { useEffect, useState } from "react"
import Loader from "@/modules/shared/others/Loader/Loader"
import Role from "../../models/role"

interface PrivateRouteProps {
	checkIsAuthenticated?: boolean
}

export function PrivateRoute({ checkIsAuthenticated = false }: PrivateRouteProps) {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

	useEffect(() => {
		const checkAuth = async () => {
			const valid = await isValidToken()
			setIsAuthenticated(valid)
		}
		checkAuth()
	}, [])

	if (isAuthenticated === null && checkIsAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<Loader />
			</div>
		)
	}

	if (!isAuthenticated && checkIsAuthenticated) {
		return <Navigate to="/login" />
	}

	return (
		<LayoutSlotProvider>
			<Outlet />
		</LayoutSlotProvider>
	)
}

export function StudentRoute() {
	const [isStudent, setIsStudent] = useState<boolean | null>(null)

	useEffect(() => {
		const checkPermissions = async () => {
			try {

				const roles = await getRolesByToken()
				setIsStudent(roles.includes(Role.ESTUDIANTE))
			} catch {
				setIsStudent(false)
			}
		}
		checkPermissions()
	}, [])

	if (isStudent === null) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<Loader />
			</div>
		)
	}

	if (!isStudent) {
		return <Navigate to="/login" />
	}

	return (
		<StudentLayout>
			<Outlet />
		</StudentLayout>
	)
}

export function TeacherRoute() {
	const [isTeacher, setIsTeacher] = useState<boolean | null>(null)

	useEffect(() => {
		const checkPermissions = async () => {
			try {

				const roles = await getRolesByToken()
				setIsTeacher(roles.includes(Role.PROFESOR))
			} catch {
				setIsTeacher(false)
			}
		}
		checkPermissions()
	}, [])

	if (isTeacher === null) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<Loader />
			</div>
		)
	}

	if (!isTeacher) {
		return <Navigate to="/login" />
	}

	return (
		<TeacherLayout>
			<Outlet />
		</TeacherLayout>
	)
}

export function CoordinatorRoute() {
	const [isCoordinator, setIsCoordinator] = useState<boolean | null>(null)

	useEffect(() => {
		const checkPermissions = async () => {
			try {

				const roles = await getRolesByToken()
				setIsCoordinator(roles.includes(Role.COORDINADOR))
			} catch {
				setIsCoordinator(false)
			}
		}
		checkPermissions()
	}, [])

	if (isCoordinator === null) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<Loader />
			</div>
		)
	}

	if (!isCoordinator) {
		return <Navigate to="/login" />
	}

	return (
		<CoordinatorLayout>
			<Outlet />
		</CoordinatorLayout>
	)
}

export function AdminRoute() {
	const [isAdmin, setIsAdmin] = useState<boolean | null>(null)

	useEffect(() => {
		const checkPermissions = async () => {
			try {

				const roles = await getRolesByToken()
				setIsAdmin(roles.includes(Role.ADMIN))
			} catch {
				setIsAdmin(false)
			}
		}
		checkPermissions()
	}, [])

	if (isAdmin === null) {
		return (
			<div className="flex min-h-screen items-center justify-center bg-gray-100">
				<Loader />
			</div>
		)
	}

	if (!isAdmin) {
		return <Navigate to="/login" />
	}

	return (
		<AdminLayout>
			<Outlet />
		</AdminLayout>
	)
}

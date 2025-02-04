import { Navigate, Outlet } from "react-router-dom";

import AdminLayout from "@/modules/admin/layout/AdminLayout";
import CoordinatorLayout from "@/modules/coordinator/layout/CoordinatorLayout";
import StudentLayout from "@/modules/student/layout/StudentLayout";
import TeacherLayout from "@/modules/teacher/layout/TeacherLayout";

export function PrivateRoute() {
  // Assert is authenticated
  // If not authenticated, redirect to login
  const isAuthenticated = false;
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  return <Outlet />;
}

export function StudentRoute() {
  // Assert is student
  // If not student, redirect to login
  const isStudent = false;
  if (!isStudent) {
    return <Navigate to="/login" />
  }

  return (
    <StudentLayout>
      <Outlet />
    </StudentLayout>
  );
}

export function TeacherRoute() {
  // Assert is teacher
  // If not teacher, redirect to login
  const isTeacher = false;
  if (!isTeacher) {
    return <Navigate to="/login" />
  }

  return (
    <TeacherLayout>
      <Outlet />
    </TeacherLayout>
  );
}

export function CoordinatorRoute() {
  // Assert is coordinator
  // If not coordinator, redirect to login
  const isCoordinator = false;
  if (!isCoordinator) {
    return <Navigate to="/login" />
  }

  return (
    <CoordinatorLayout>
      <Outlet />
    </CoordinatorLayout>
  );
}

export function AdminRoute() {
  // Assert is admin
  // If not admin, redirect to login
  const isAdmin = false;
  if (!isAdmin) {
    return <Navigate to="/login" />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

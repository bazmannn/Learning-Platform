import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./layouts/Layout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import AllTeachers from "./pages/teachers/AllTeachers";
import AllParents from "./pages/parents/AllParents";
import AddParent from "./pages/parents/AddParent";
import ParentDetails from "./pages/parents/ParentDetails";
import TeacherDetails from "./pages/teachers/TeacherDetails";
import AddTeacher from "./pages/teachers/AddTeacher";
import AllStudents from "./pages/students/AllStudents";
import AddStudent from "./pages/students/AddStudent";
import AllSubjects from "./pages/subjects/AllSubjects";
import AddSubject from "./pages/subjects/AddSubject";
import StudentDetails from "./pages/students/StudentDetails";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Layout hideNavbar>
              <Login />
            </Layout>
          }
        />
        <Route
          path="/register"
          element={
            <Layout hideNavbar>
              <Register />
            </Layout>
          }
        />

        <Route
          path="/"
          element={
            <Layout>
              <ProtectedRoute>
                <Homepage />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/teachers"
          element={
            <Layout>
              <ProtectedRoute>
                <AllTeachers />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/add-teacher"
          element={
            <Layout>
              <ProtectedRoute>
                <AddTeacher />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/teachers/:teacherId"
          element={
            <Layout>
              <ProtectedRoute>
                <TeacherDetails />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/parents"
          element={
            <Layout>
              <ProtectedRoute>
                <AllParents />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/add-parent"
          element={
            <Layout>
              <ProtectedRoute>
                <AddParent />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/parents/:parentId"
          element={
            <Layout>
              <ProtectedRoute>
                <ParentDetails />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/students"
          element={
            <Layout>
              <ProtectedRoute>
                <AllStudents />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/add-student"
          element={
            <Layout>
              <ProtectedRoute>
                <AddStudent />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/students/:studentId"
          element={
            <Layout>
              <ProtectedRoute>
                <StudentDetails />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/subjects"
          element={
            <Layout>
              <ProtectedRoute>
                <AllSubjects />
              </ProtectedRoute>
            </Layout>
          }
        />

        <Route
          path="/admin/add-subject"
          element={
            <Layout>
              <ProtectedRoute>
                <AddSubject />
              </ProtectedRoute>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

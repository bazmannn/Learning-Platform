import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/homepage/Homepage";
import ClassPage from "./pages/classpage/ClassPage";
import CourseContentPage from "./pages/classpage/CourseContentPage"; // Import the new page
import Layout from "./layouts/Layout";
import Login from "./pages/auth/Login";
import ProfilePage from "./pages/profile/ProfilePage";
import ManageStudentsPage from "./pages/profile/ManageStudentsPage";
import CourseManagementPage from "./pages/course/CourseManagementPage";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <Homepage />
            </Layout>
          }
        />
        <Route
          path="/class/:classId"
          element={
            <Layout>
              <ClassPage />
            </Layout>
          }
        />

        <Route
          path="/course/:courseId"
          element={
            <Layout>
              <CourseContentPage />
            </Layout>
          }
        />

        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <ProfilePage />
            </Layout>
          }
        />

        <Route
          path="/profile/manage-students"
          element={
            <Layout>
              <ManageStudentsPage />
            </Layout>
          }
        />

        <Route
          path="/teacher/course/"
          element={
            <Layout>
              <CourseManagementPage />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRoutes;

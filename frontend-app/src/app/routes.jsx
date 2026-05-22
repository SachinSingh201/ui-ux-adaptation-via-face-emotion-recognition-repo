import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Dashboard } from "./components/Dashboard";
import { CoursesPage } from "./components/CoursesPage";
import { CourseDetailPage } from "./components/CourseDetailPage";
import { LessonPage } from "./components/LessonPage";
import { ProfilePage } from "./components/ProfilePage";
import { ProtectedRoute } from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: LoginPage },
      { path: "signup", Component: SignupPage },
      { 
        path: "dashboard", 
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        )
      },
      { 
        path: "courses", 
        element: (
          <ProtectedRoute>
            <CoursesPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "courses/:courseId", 
        element: (
          <ProtectedRoute>
            <CourseDetailPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "courses/:courseId/lessons/:lessonId", 
        element: (
          <ProtectedRoute>
            <LessonPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        )
      },
    ],
  },
]);

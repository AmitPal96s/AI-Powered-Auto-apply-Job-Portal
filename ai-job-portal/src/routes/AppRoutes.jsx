import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import Jobs from "../pages/Jobs/Jobs";
import Profile from "../pages/Profile/Profile";
import Dashboard from "../pages/Dashboard/Dashboard";
import Applications from "../pages/Applications/Applications";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import ProtectedRoute from "./ProtectedRoutes";
import PublicRoute from "./PublicRoute";
import MainLayout from "../components/layout/MainLayout";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Routes with Main Layout */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />

                <Route
                    path="/jobs"
                    element={
                        <ProtectedRoute>
                            <Jobs />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/applications"
                    element={
                        <ProtectedRoute>
                            <Applications />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Public Routes */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />
        </Routes>
    );
};

export default AppRoutes;
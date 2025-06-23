import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import EmployeePage from "./pages/employee/EmployeePage";
import LoginPage from "./pages/login/LoginPage";
import SupervisorPage from "./pages/supervisor/SupervisorPage";
import { UserProvider } from "./auth/UserContext";
import PrivateRoute from "./auth/PrivateRoute";
import Layout from "./components/Layout";

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage />,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "employee",
                element: (
                    <PrivateRoute requiredRole="employee">
                        <EmployeePage />
                    </PrivateRoute>
                ),
            },
            {
                path: "supervisor",
                element: (
                    <PrivateRoute requiredRole="supervisor">
                        <SupervisorPage />
                    </PrivateRoute>
                ),
            },
        ],
    },
]);

function App() {
    return (
        <UserProvider>
            <RouterProvider router={router} />
        </UserProvider>
    );
}

export default App;

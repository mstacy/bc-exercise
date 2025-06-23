import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/page";
import EmployeePage from "./pages/employee/page";
import LoginPage from "./pages/login/page";
import SupervisorPage from "./pages/supervisor/page";
import { UserProvider } from "./auth/UserContext";
import PrivateRoute from "./auth/PrivateRoute";

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
        path: "/employee",
        element: (
            <PrivateRoute requiredRole="employee">
                <EmployeePage />
            </PrivateRoute>
        ),
    },
    {
        path: "/supervisor",
        element: (
            <PrivateRoute requiredRole="supervisor">
                <SupervisorPage />
            </PrivateRoute>
        ),
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

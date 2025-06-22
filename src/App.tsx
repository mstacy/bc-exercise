import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/page";
import EmployeePage from "./pages/employee/page";
import LoginPage from "./pages/login/page";
import SupervisorPage from "./pages/supervisor/page";

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
        element: <EmployeePage />,
    },
    {
        path: "/supervisor",
        element: <SupervisorPage />,
    },
]);

function App() {
    return <RouterProvider router={router} />;
}

export default App;

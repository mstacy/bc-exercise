import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/login/LoginPage";
import { UserProvider } from "./auth/UserContext";
import PrivateRoute from "./auth/PrivateRoute";
import Layout from "./components/Layout";
import { ROLE_CONFIGS } from "./auth/roles";

const protectedRoutes = Object.values(ROLE_CONFIGS).map((config) => ({
    path: config.route.substring(1),
    element: (
        <PrivateRoute requiredRole={config.role}>
            <config.component />
        </PrivateRoute>
    ),
}));

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
        children: [...protectedRoutes],
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

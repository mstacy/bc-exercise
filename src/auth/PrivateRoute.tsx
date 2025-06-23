import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { CircularProgress, Box } from "@mui/material";

interface PrivateRouteProps {
    children: ReactNode;
    requiredRole: "employee" | "supervisor";
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="100vh"
            >
                <CircularProgress />
            </Box>
        );
    }

    if (!user) {
        // Not logged in
        return <Navigate to="/login" replace />;
    }

    if (user.role !== requiredRole) {
        // Logged in but wrong role
        return <Navigate to={`/${user.role}`} replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { CircularProgress, Box } from "@mui/material";
import { Role, ROLE_CONFIGS } from "./roles";

const LoadingSpinner = () => (
    <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
    >
        <CircularProgress />
    </Box>
);

interface PrivateRouteProps {
    children: ReactNode;
    requiredRole: Role;
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
    const { user, loading } = useUser();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;

    if (user.role !== requiredRole) {
        // Automatically redirect to user's appropriate dashboard
        const userRoleConfig = ROLE_CONFIGS[user.role];
        return <Navigate to={userRoleConfig.route} replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;

import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "./UserContext";

interface PrivateRouteProps {
    children: ReactNode;
    requiredRole: "employee" | "supervisor";
}

const PrivateRoute = ({ children, requiredRole }: PrivateRouteProps) => {
    const { user } = useUser();
    console.log({ user });

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

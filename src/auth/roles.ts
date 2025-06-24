import EmployeePage from "../pages/employee/EmployeePage";
import SupervisorPage from "../pages/supervisor/SupervisorPage";

export const ROLES = {
    EMPLOYEE: "employee",
    SUPERVISOR: "supervisor",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface RoleConfig {
    role: Role;
    route: string;
    component: React.ComponentType;
    label: string;
    permissions?: string[];
}

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
    [ROLES.EMPLOYEE]: {
        role: ROLES.EMPLOYEE,
        route: "/employee",
        component: EmployeePage,
        label: "Employee Dashboard",
    },
    [ROLES.SUPERVISOR]: {
        role: ROLES.SUPERVISOR,
        route: "/supervisor",
        component: SupervisorPage,
        label: "Supervisor Dashboard",
    },
};

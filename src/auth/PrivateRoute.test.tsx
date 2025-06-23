import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import PrivateRoute from "./PrivateRoute";
import { UserContext } from "./UserContext";
import { User } from "./UserContext";

// Mock react-router-dom
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    Navigate: ({ to }: { to: string }) => (
        <div data-testid="navigate" data-to={to}>
            Navigate to {to}
        </div>
    ),
}));

// Create a test theme for Material-UI components
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({
    children,
    user,
    loading = false,
}: {
    children: React.ReactNode;
    user: User | null;
    loading?: boolean;
}) => (
    <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser: jest.fn(), loading }}>
            <MemoryRouter>{children}</MemoryRouter>
        </UserContext.Provider>
    </ThemeProvider>
);

// Test component to render inside PrivateRoute
const TestComponent = () => (
    <div data-testid="protected-content">Protected Content</div>
);

describe("PrivateRoute", () => {
    const mockEmployee: User = {
        id: 1,
        username: "employee1",
        role: "employee",
        token: "employee-token",
    };

    const mockSupervisor: User = {
        id: 2,
        username: "supervisor1",
        role: "supervisor",
        token: "supervisor-token",
    };

    describe("Loading state", () => {
        it("should show loading spinner when loading is true", () => {
            render(
                <TestWrapper user={null} loading={true}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(
                screen.queryByTestId("protected-content")
            ).not.toBeInTheDocument();
            expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
        });
    });

    describe("Unauthenticated users", () => {
        it("should redirect to login when user is null", () => {
            render(
                <TestWrapper user={null} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            const navigateElement = screen.getByTestId("navigate");
            expect(navigateElement).toBeInTheDocument();
            expect(navigateElement).toHaveAttribute("data-to", "/login");
            expect(
                screen.queryByTestId("protected-content")
            ).not.toBeInTheDocument();
        });

        it("should redirect to login when user is null for supervisor role", () => {
            render(
                <TestWrapper user={null} loading={false}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            const navigateElement = screen.getByTestId("navigate");
            expect(navigateElement).toBeInTheDocument();
            expect(navigateElement).toHaveAttribute("data-to", "/login");
            expect(
                screen.queryByTestId("protected-content")
            ).not.toBeInTheDocument();
        });
    });

    describe("Wrong role access", () => {
        it("should redirect employee to employee page when trying to access supervisor route", () => {
            render(
                <TestWrapper user={mockEmployee} loading={false}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            const navigateElement = screen.getByTestId("navigate");
            expect(navigateElement).toBeInTheDocument();
            expect(navigateElement).toHaveAttribute("data-to", "/employee");
            expect(
                screen.queryByTestId("protected-content")
            ).not.toBeInTheDocument();
        });

        it("should redirect supervisor to supervisor page when trying to access employee route", () => {
            render(
                <TestWrapper user={mockSupervisor} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            const navigateElement = screen.getByTestId("navigate");
            expect(navigateElement).toBeInTheDocument();
            expect(navigateElement).toHaveAttribute("data-to", "/supervisor");
            expect(
                screen.queryByTestId("protected-content")
            ).not.toBeInTheDocument();
        });
    });

    describe("Successful access", () => {
        it("should render children when employee accesses employee route", () => {
            render(
                <TestWrapper user={mockEmployee} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });

        it("should render children when supervisor accesses supervisor route", () => {
            render(
                <TestWrapper user={mockSupervisor} loading={false}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        });

        it("should render multiple children correctly", () => {
            const MultipleChildren = () => (
                <>
                    <div data-testid="child1">Child 1</div>
                    <div data-testid="child2">Child 2</div>
                </>
            );

            render(
                <TestWrapper user={mockEmployee} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <MultipleChildren />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId("child1")).toBeInTheDocument();
            expect(screen.getByTestId("child2")).toBeInTheDocument();
            expect(screen.queryByTestId("navigate")).not.toBeInTheDocument();
        });
    });

    describe("Component props", () => {
        it("should accept requiredRole prop correctly", () => {
            const { rerender } = render(
                <TestWrapper user={mockEmployee} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();

            // Test with different role
            rerender(
                <TestWrapper user={mockSupervisor} loading={false}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByTestId("protected-content")).toBeInTheDocument();
        });
    });

    describe("Edge cases", () => {
        it("should handle loading state transition correctly", () => {
            const { rerender } = render(
                <TestWrapper user={null} loading={true}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();

            // Transition to loaded state with no user
            rerender(
                <TestWrapper user={null} loading={false}>
                    <PrivateRoute requiredRole="employee">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            expect(screen.getByTestId("navigate")).toHaveAttribute(
                "data-to",
                "/login"
            );
        });

        it("should handle role mismatch after loading", () => {
            const { rerender } = render(
                <TestWrapper user={null} loading={true}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.getByRole("progressbar")).toBeInTheDocument();

            // Transition to loaded state with wrong role
            rerender(
                <TestWrapper user={mockEmployee} loading={false}>
                    <PrivateRoute requiredRole="supervisor">
                        <TestComponent />
                    </PrivateRoute>
                </TestWrapper>
            );

            expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
            expect(screen.getByTestId("navigate")).toHaveAttribute(
                "data-to",
                "/employee"
            );
        });
    });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import LoginPage from "./LoginPage";
import { UserContext } from "../../auth/UserContext";
import { User } from "../../auth/UserContext";

// Mock react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => mockNavigate,
}));

// Mock fetch
global.fetch = jest.fn();

// Create a test theme for Material-UI components
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({
    children,
    user = null,
    setUser = jest.fn(),
}: {
    children: React.ReactNode;
    user?: User | null;
    setUser?: jest.Mock;
}) => (
    <ThemeProvider theme={theme}>
        <UserContext.Provider value={{ user, setUser, loading: false }}>
            <MemoryRouter>{children}</MemoryRouter>
        </UserContext.Provider>
    </ThemeProvider>
);

describe("LoginPage", () => {
    const mockEmployee: User = {
        id: 1,
        username: "alice",
        role: "employee",
        token: "employee-token",
    };

    const mockSupervisor: User = {
        id: 2,
        username: "carol",
        role: "supervisor",
        token: "supervisor-token",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    describe("Initial render", () => {
        it("should render login form with all elements", () => {
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            expect(screen.getByTestId("login-title")).toHaveTextContent(
                "Sign In"
            );
            expect(
                screen.getByText("Please sign in to continue")
            ).toBeInTheDocument();
            expect(screen.getByTestId("login-username")).toBeInTheDocument();
            expect(screen.getByTestId("login-password")).toBeInTheDocument();
            expect(screen.getByTestId("login-submit")).toBeInTheDocument();
            expect(screen.getByText("Demo Credentials")).toBeInTheDocument();
        });
    });

    describe("Form validation", () => {
        it("should show error for empty username", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const submitButton = screen.getByTestId("login-submit");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Username is required")
                ).toBeInTheDocument();
            });
        });

        it("should show error for username less than 3 characters", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            await user.type(usernameInput, "ab");

            const submitButton = screen.getByTestId("login-submit");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Username must be at least 3 characters")
                ).toBeInTheDocument();
            });
        });

        it("should show error for empty password", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            await user.type(usernameInput, "validuser");

            const submitButton = screen.getByTestId("login-submit");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Password is required")
                ).toBeInTheDocument();
            });
        });

        it("should show error for password less than 6 characters", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");

            await user.type(usernameInput, "validuser");
            await user.type(passwordInput, "12345");

            const submitButton = screen.getByTestId("login-submit");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Password must be at least 6 characters")
                ).toBeInTheDocument();
            });
        });

        it("should not show validation errors for valid input", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");

            await user.type(usernameInput, "validuser");
            await user.type(passwordInput, "validpassword");

            expect(
                screen.queryByText("Username is required")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Password is required")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Username must be at least 3 characters")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Password must be at least 6 characters")
            ).not.toBeInTheDocument();
        });
    });

    describe("Password visibility toggle", () => {
        it("should toggle password visibility when eye icon is clicked", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const passwordInput = screen.getByTestId("login-password");
            const toggleButton = screen.getByLabelText(
                "toggle password visibility"
            );

            // Initially password should be hidden
            expect(passwordInput).toHaveAttribute("type", "password");

            // Click to show password
            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute("type", "text");

            // Click to hide password again
            await user.click(toggleButton);
            expect(passwordInput).toHaveAttribute("type", "password");
        });
    });

    describe("Authentication flow", () => {
        it("should handle authentication failure", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => null, // No user returned
            });

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "invaliduser");
            await user.type(passwordInput, "invalidpass");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Invalid username or password")
                ).toBeInTheDocument();
            });

            expect(mockSetUser).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it("should handle network error", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockRejectedValueOnce(
                new Error("Network error")
            );

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "alice");
            await user.type(passwordInput, "password123");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        "An error occurred during login. Please try again."
                    )
                ).toBeInTheDocument();
            });

            expect(mockSetUser).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it("should handle HTTP error response", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 401,
            });

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "alice");
            await user.type(passwordInput, "password123");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText(
                        "An error occurred during login. Please try again."
                    )
                ).toBeInTheDocument();
            });

            expect(mockSetUser).not.toHaveBeenCalled();
            expect(mockNavigate).not.toHaveBeenCalled();
        });

        it("should successfully authenticate employee and redirect", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockEmployee,
            });

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "alice");
            await user.type(passwordInput, "password123");
            await user.click(submitButton);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith(
                    "http://localhost:3001/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            username: "alice",
                            password: "password123",
                        }),
                    }
                );
            });

            await waitFor(() => {
                expect(mockSetUser).toHaveBeenCalledWith(mockEmployee);
            });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/employee", {
                    replace: false,
                });
            });
        });

        it("should successfully authenticate supervisor and redirect", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockSupervisor,
            });

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "carol");
            await user.type(passwordInput, "adminpass");
            await user.click(submitButton);

            await waitFor(() => {
                expect(mockSetUser).toHaveBeenCalledWith(mockSupervisor);
            });
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith("/supervisor", {
                    replace: false,
                });
            });
        });

        it("should show loading state during authentication", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            // Mock a delayed response
            (fetch as jest.Mock).mockImplementationOnce(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    ok: true,
                                    json: async () => mockEmployee,
                                }),
                            100
                        )
                    )
            );

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "alice");
            await user.type(passwordInput, "password123");
            await user.click(submitButton);

            // Should show loading spinner
            expect(screen.getByRole("progressbar")).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
            expect(usernameInput).toBeDisabled();
            expect(passwordInput).toBeDisabled();
        });
    });

    describe("Auto-redirect for logged in users", () => {
        it("should redirect employee to employee page if already logged in", () => {
            render(
                <TestWrapper user={mockEmployee}>
                    <LoginPage />
                </TestWrapper>
            );

            expect(mockNavigate).toHaveBeenCalledWith("/employee", {
                replace: true,
            });
        });

        it("should redirect supervisor to supervisor page if already logged in", () => {
            render(
                <TestWrapper user={mockSupervisor}>
                    <LoginPage />
                </TestWrapper>
            );

            expect(mockNavigate).toHaveBeenCalledWith("/supervisor", {
                replace: true,
            });
        });

        it("should not redirect if user is not logged in", () => {
            render(
                <TestWrapper user={null}>
                    <LoginPage />
                </TestWrapper>
            );

            expect(mockNavigate).not.toHaveBeenCalled();
        });
    });

    describe("Form reset on error", () => {
        it("should reset form fields after authentication failure", async () => {
            const user = userEvent.setup();
            const mockSetUser = jest.fn();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => null,
            });

            render(
                <TestWrapper setUser={mockSetUser}>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            await user.type(usernameInput, "invaliduser");
            await user.type(passwordInput, "invalidpass");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Invalid username or password")
                ).toBeInTheDocument();
            });

            // Form should be reset
            expect(usernameInput).toHaveValue("");
            expect(passwordInput).toHaveValue("");
        });
    });

    describe("Accessibility", () => {
        it("should have proper form labels and accessibility attributes", () => {
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const usernameInput = screen.getByTestId("login-username");
            const passwordInput = screen.getByTestId("login-password");
            const submitButton = screen.getByTestId("login-submit");

            expect(usernameInput).toHaveAttribute("id", "username");
            expect(usernameInput).toHaveAttribute("autoComplete", "username");

            expect(passwordInput).toHaveAttribute("id", "password");
            expect(passwordInput).toHaveAttribute(
                "autoComplete",
                "current-password"
            );

            expect(submitButton).toHaveAttribute("type", "submit");
        });

        it("should have proper password toggle button accessibility", () => {
            render(
                <TestWrapper>
                    <LoginPage />
                </TestWrapper>
            );

            const toggleButton = screen.getByLabelText(
                "toggle password visibility"
            );
            expect(toggleButton).toBeInTheDocument();
        });
    });
});

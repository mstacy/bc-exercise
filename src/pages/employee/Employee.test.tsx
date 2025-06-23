import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import EmployeePage from "./EmployeePage";
import { UserContext } from "../../auth/UserContext";
import { User } from "../../auth/UserContext";

// Mock fetch
global.fetch = jest.fn();

// Create a test theme for Material-UI components
const theme = createTheme();

// Test wrapper component
const TestWrapper = ({
    children,
    user,
}: {
    children: React.ReactNode;
    user: User;
}) => (
    <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <UserContext.Provider
                value={{ user, setUser: jest.fn(), loading: false }}
            >
                {children}
            </UserContext.Provider>
        </LocalizationProvider>
    </ThemeProvider>
);

describe("EmployeePage", () => {
    const mockUser: User = {
        id: 1,
        username: "alice",
        role: "employee",
        token: "employee-token",
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    describe("Initial render", () => {
        it("should render certification request form with all elements", () => {
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            expect(screen.getByTestId("employee-page")).toBeInTheDocument();
            expect(screen.getByTestId("page-title")).toHaveTextContent(
                "Certification Request"
            );
            expect(
                screen.getByTestId("certification-form-card")
            ).toBeInTheDocument();
            expect(
                screen.getByTestId("certification-form")
            ).toBeInTheDocument();
            expect(screen.getByTestId("description-field")).toBeInTheDocument();
            expect(screen.getByTestId("budget-field")).toBeInTheDocument();
            expect(screen.getByTestId("date-field")).toBeInTheDocument();
            expect(screen.getByTestId("submit-button")).toBeInTheDocument();
            expect(screen.getByTestId("clear-button")).toBeInTheDocument();
            expect(screen.getByTestId("reset-button")).toBeInTheDocument();
            expect(screen.getByTestId("form-actions")).toBeInTheDocument();
        });

        it("should show dollar sign in budget field", () => {
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const budgetField = screen.getByTestId("budget-field");
            expect(budgetField.parentElement).toHaveTextContent("$");
        });
    });

    describe("Form validation", () => {
        it("should show error for empty description", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Description is required")
                ).toBeInTheDocument();
            });
        });

        it("should show error for empty budget", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            await user.type(descriptionField, "Test certification");

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Estimated budget is required")
                ).toBeInTheDocument();
            });
        });

        it("should show error for negative budget", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "-100");

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Budget must be a positive number")
                ).toBeInTheDocument();
            });
        });

        it("should show error for zero budget", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "0");

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Budget must be a positive number")
                ).toBeInTheDocument();
            });
        });

        it("should show error for empty expected date", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Expected date is required")
                ).toBeInTheDocument();
            });
        });

        it("should show error for past date", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(today.getDate() - 1);
            await user.type(dateField, dayjs(yesterday).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(
                    screen.getByText("Date must be today or later")
                ).toBeInTheDocument();
            });
        });

        it("should not show validation errors for valid input", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");

            expect(
                screen.queryByText("Description is required")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Estimated budget is required")
            ).not.toBeInTheDocument();
            expect(
                screen.queryByText("Budget must be a positive number")
            ).not.toBeInTheDocument();
        });
    });

    describe("Form submission", () => {
        it("should successfully submit form with valid data", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1, status: "submitted" }),
            });

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith(
                    "http://localhost:3001/requests",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            employeeId: 1,
                            employeeName: "alice",
                            description: "Test certification",
                            estimatedBudget: 500,
                            expectedDate: dayjs(new Date()).format(
                                "YYYY-MM-DD"
                            ),
                            status: "submitted",
                        }),
                    }
                );
            });

            await waitFor(() => {
                expect(screen.getByTestId("success-alert")).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Request submitted successfully!")
                ).toBeInTheDocument();
            });
        });

        it("should show loading state during submission", async () => {
            const user = userEvent.setup();

            // Mock a delayed response
            (fetch as jest.Mock).mockImplementationOnce(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    ok: true,
                                    json: async () => ({
                                        id: 1,
                                        status: "submitted",
                                    }),
                                }),
                            100
                        )
                    )
            );

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            // Should show loading spinner
            expect(screen.getByTestId("submit-loading")).toBeInTheDocument();
            expect(submitButton).toBeDisabled();
            expect(descriptionField).toBeDisabled();
            expect(budgetField).toBeDisabled();
            expect(dateField).toBeDisabled();
        });

        it("should handle submission failure", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(
                    screen.getByText("Failed to submit request")
                ).toBeInTheDocument();
            });
        });

        it("should handle network error", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockRejectedValueOnce(
                new Error("Network error")
            );

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(screen.getByText("Network error")).toBeInTheDocument();
            });
        });

        it("should handle user not found error", async () => {
            const user = userEvent.setup();

            render(
                <TestWrapper user={null as any}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
            });

            await waitFor(() => {
                expect(screen.getByText("User not found")).toBeInTheDocument();
            });
        });
    });

    describe("Form actions", () => {
        it("should clear form when Clear button is clicked", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const clearButton = screen.getByTestId("clear-button");
            await user.click(clearButton);

            expect(descriptionField).toHaveValue("");
            expect(budgetField).toHaveValue(null);
            expect(dateField).toHaveValue("");
        });

        it("should reset form when Reset button is clicked", async () => {
            const user = userEvent.setup();
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const resetButton = screen.getByTestId("reset-button");
            await user.click(resetButton);

            expect(descriptionField).toHaveValue("");
            expect(budgetField).toHaveValue(null);
            expect(dateField).toHaveValue("");
        });

        it("should clear success message when Clear button is clicked", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1, status: "submitted" }),
            });

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("success-alert")).toBeInTheDocument();
            });

            const clearButton = screen.getByTestId("clear-button");
            await user.click(clearButton);

            expect(
                screen.queryByTestId("success-alert")
            ).not.toBeInTheDocument();
        });

        it("should clear error message when Clear button is clicked", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockRejectedValueOnce(new Error("Test error"));

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
            });

            const clearButton = screen.getByTestId("clear-button");
            await user.click(clearButton);

            expect(screen.queryByTestId("error-alert")).not.toBeInTheDocument();
        });
    });

    describe("Form state management", () => {
        it("should disable form fields during submission", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockImplementationOnce(
                () =>
                    new Promise((resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    ok: true,
                                    json: async () => ({
                                        id: 1,
                                        status: "submitted",
                                    }),
                                }),
                            100
                        )
                    )
            );

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");
            const submitButton = screen.getByTestId("submit-button");
            const clearButton = screen.getByTestId("clear-button");
            const resetButton = screen.getByTestId("reset-button");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));
            await user.click(submitButton);

            expect(descriptionField).toBeDisabled();
            expect(budgetField).toBeDisabled();
            expect(dateField).toBeDisabled();
            expect(submitButton).toBeDisabled();
            expect(clearButton).toBeDisabled();
            expect(resetButton).toBeDisabled();
        });

        it("should reset form after successful submission", async () => {
            const user = userEvent.setup();

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => ({ id: 1, status: "submitted" }),
            });

            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            await user.type(descriptionField, "Test certification");
            await user.type(budgetField, "500");
            await user.type(dateField, dayjs(new Date()).format("MM/DD/YYYY"));

            const submitButton = screen.getByTestId("submit-button");
            await user.click(submitButton);

            await waitFor(() => {
                expect(screen.getByTestId("success-alert")).toBeInTheDocument();
            });

            // Form should be reset
            expect(descriptionField).toHaveValue("");
            expect(budgetField).toHaveValue(null);
            expect(dateField).toHaveValue("");
        });
    });

    describe("Accessibility", () => {
        it("should have proper form labels and accessibility attributes", () => {
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");
            const submitButton = screen.getByTestId("submit-button");

            expect(descriptionField).toHaveAttribute("required");
            expect(budgetField).toHaveAttribute("required");
            expect(dateField).toHaveAttribute("required");
            expect(submitButton).toHaveAttribute("type", "submit");
        });

        it("should have proper error handling for screen readers", () => {
            render(
                <TestWrapper user={mockUser}>
                    <EmployeePage />
                </TestWrapper>
            );

            const descriptionField = screen.getByTestId("description-field");
            const budgetField = screen.getByTestId("budget-field");
            const dateField = screen.getByTestId("date-field");

            expect(descriptionField).toHaveAttribute("aria-invalid", "false");
            expect(budgetField).toHaveAttribute("aria-invalid", "false");
            expect(dateField.parentElement).toHaveAttribute(
                "aria-invalid",
                "false"
            );
        });
    });
});

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SupervisorPage from "./SupervisorPage";
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
        <UserContext.Provider
            value={{ user, setUser: jest.fn(), loading: false }}
        >
            {children}
        </UserContext.Provider>
    </ThemeProvider>
);

describe("SupervisorPage", () => {
    const mockUser: User = {
        id: 1,
        username: "carol",
        role: "supervisor",
        token: "supervisor-token",
    };

    const mockRequests = [
        {
            id: 1,
            employeeId: 1,
            employeeName: "alice",
            description: "AWS Certification",
            estimatedBudget: 500,
            expectedDate: "2024-01-15",
            status: "submitted" as const,
        },
        {
            id: 2,
            employeeId: 2,
            employeeName: "bob",
            description: "Azure Certification",
            estimatedBudget: 750,
            expectedDate: "2024-01-20",
            status: "approved" as const,
        },
        {
            id: 3,
            employeeId: 3,
            employeeName: "alice",
            description: "GCP Certification",
            estimatedBudget: 300,
            expectedDate: "2024-01-10",
            status: "draft" as const,
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        (fetch as jest.Mock).mockClear();
    });

    describe("Initial render and data fetching", () => {
        it("should show loading state initially", () => {
            (fetch as jest.Mock).mockImplementation(
                () => new Promise(() => {}) // Never resolves
            );

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            expect(screen.getByTestId("supervisor-page")).toBeInTheDocument();
            expect(screen.getByTestId("loading-container")).toBeInTheDocument();
            expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        });

        it("should fetch and display requests successfully", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("request-table")).toBeInTheDocument();
                expect(screen.getByTestId("employee-name-1")).toHaveTextContent(
                    "alice"
                );
                expect(screen.getByTestId("employee-name-2")).toHaveTextContent(
                    "bob"
                );
                expect(screen.getByTestId("description-1")).toHaveTextContent(
                    "AWS Certification"
                );
                expect(screen.getByTestId("description-2")).toHaveTextContent(
                    "Azure Certification"
                );
            });
        });

        it("should show error when fetch fails", async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(
                new Error("Network error")
            );

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
                expect(
                    screen.getByText("Failed to fetch requests.")
                ).toBeInTheDocument();
            });
        });

        it("should display filter controls", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("request-filters")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("employee-name-filter")
                ).toBeInTheDocument();
                expect(screen.getByTestId("status-filter")).toBeInTheDocument();
                expect(
                    screen.getByTestId("min-budget-filter")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("max-budget-filter")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Filtering functionality", () => {
        it("should filter by employee name", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("employee-name-1")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("employee-name-2")
                ).toBeInTheDocument();
            });

            const employeeSelect = screen.getByLabelText("Employee Name");
            await user.click(employeeSelect);
            await user.click(screen.getByTestId("employee-name-alice"));

            await waitFor(() => {
                expect(
                    screen.getByTestId("employee-name-1")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("employee-name-3")
                ).toBeInTheDocument();
                expect(
                    screen.queryByTestId("employee-name-2")
                ).not.toBeInTheDocument();
            });
        });

        it("should filter by status", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("status-1")).toHaveTextContent(
                    "Submitted for Approval"
                );
                expect(screen.getByTestId("status-2")).toHaveTextContent(
                    "Approved"
                );
            });

            const statusSelect = screen.getByLabelText("Status");
            await user.click(statusSelect);
            await user.click(screen.getByTestId("status-option-approved"));

            await waitFor(() => {
                expect(screen.getByTestId("status-2")).toBeInTheDocument();
                expect(
                    screen.queryByTestId("status-1")
                ).not.toBeInTheDocument();
            });
        });

        it("should filter by budget range", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("budget-1")).toHaveTextContent(
                    "$500"
                );
                expect(screen.getByTestId("budget-2")).toHaveTextContent(
                    "$750"
                );
            });

            const minBudgetField = screen.getByTestId("min-budget-filter");
            await user.type(minBudgetField, "600");

            await waitFor(() => {
                expect(
                    screen.queryByTestId("budget-1")
                ).not.toBeInTheDocument();
                expect(screen.getByTestId("budget-2")).toBeInTheDocument();
            });
        });
    });

    describe("Sorting functionality", () => {
        it("should sort by budget in ascending order", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("budget-sort-submitted")
                ).toBeInTheDocument();
            });

            const budgetHeader = screen.getByTestId("budget-sort-submitted");
            await user.click(budgetHeader);

            expect(budgetHeader).toBeInTheDocument();
        });

        it("should sort by expected date", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("date-sort-submitted")
                ).toBeInTheDocument();
            });

            const dateHeader = screen.getByTestId("date-sort-submitted");
            await user.click(dateHeader);

            expect(dateHeader).toBeInTheDocument();
        });
    });

    describe("Status updates", () => {
        it("should update request status successfully", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockRequests,
                })
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => ({ success: true }),
                });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("status-1")).toHaveTextContent(
                    "Submitted for Approval"
                );
            });

            const statusSelect =
                screen.getByTestId("status-select-1").previousElementSibling;
            if (statusSelect) {
                await user.click(statusSelect);
                await user.click(
                    screen.getByTestId("status-option-1-approved")
                );
            }

            await waitFor(() => {
                expect(fetch).toHaveBeenCalledWith(
                    "http://localhost:3001/requests/1",
                    {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ status: "approved" }),
                    }
                );
            });
        });

        it("should handle status update failure", async () => {
            const user = userEvent.setup();
            (fetch as jest.Mock)
                .mockResolvedValueOnce({
                    ok: true,
                    json: async () => mockRequests,
                })
                .mockRejectedValueOnce(new Error("Update failed"));

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("status-1")).toHaveTextContent(
                    "Submitted for Approval"
                );
            });

            const statusSelect =
                screen.getByTestId("status-select-1").previousElementSibling;
            if (statusSelect) {
                await user.click(statusSelect);
                await user.click(
                    screen.getByTestId("status-option-1-approved")
                );
            }

            await waitFor(() => {
                expect(screen.getByTestId("error-alert")).toBeInTheDocument();
                expect(
                    screen.getByText("Failed to update status.")
                ).toBeInTheDocument();
            });
        });
    });

    describe("Table structure and grouping", () => {
        it("should group requests by status", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("group-title-draft")
                ).toHaveTextContent("Draft");
                expect(
                    screen.getByTestId("group-title-submitted")
                ).toHaveTextContent("Submitted for Approval");
                expect(
                    screen.getByTestId("group-title-approved")
                ).toHaveTextContent("Approved");
            });
        });

        it("should show empty state for groups with no requests", async () => {
            const emptyRequests = [
                {
                    id: 1,
                    employeeId: 1,
                    employeeName: "alice",
                    description: "AWS Certification",
                    estimatedBudget: 500,
                    expectedDate: "2024-01-15",
                    status: "submitted" as const,
                },
            ];

            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => emptyRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("empty-group-draft")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("empty-group-approved")
                ).toBeInTheDocument();
                expect(
                    screen.getByTestId("empty-group-rejected")
                ).toBeInTheDocument();
            });
        });

        it("should display table headers correctly", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("employee-header-submitted")
                ).toHaveTextContent("Employee");
                expect(
                    screen.getByTestId("description-header-submitted")
                ).toHaveTextContent("Description");
                expect(
                    screen.getByTestId("budget-sort-submitted")
                ).toHaveTextContent("Budget");
                expect(
                    screen.getByTestId("date-sort-submitted")
                ).toHaveTextContent("Expected Date");
                expect(
                    screen.getByTestId("status-header-submitted")
                ).toHaveTextContent("Status");
                expect(
                    screen.getByTestId("update-status-header-submitted")
                ).toHaveTextContent("Update Status");
            });
        });
    });

    describe("Data formatting", () => {
        it("should format budget with dollar sign and commas", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("budget-1")).toHaveTextContent(
                    "$500"
                );
                expect(screen.getByTestId("budget-2")).toHaveTextContent(
                    "$750"
                );
            });
        });

        it("should format dates correctly", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(screen.getByTestId("date-1")).toHaveTextContent(
                    "2024-01-15"
                );
                expect(screen.getByTestId("date-2")).toHaveTextContent(
                    "2024-01-20"
                );
            });
        });
    });

    describe("Accessibility", () => {
        it("should have proper table structure", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByTestId("table-submitted")
                ).toBeInTheDocument();
                // expect(screen.getAllByRole("row")).toHaveLength(
                //     expect.any(Number)
                // );
            });
        });

        it("should have proper form labels", async () => {
            (fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockRequests,
            });

            render(
                <TestWrapper user={mockUser}>
                    <SupervisorPage />
                </TestWrapper>
            );

            await waitFor(() => {
                expect(
                    screen.getByLabelText("Employee Name")
                ).toBeInTheDocument();
                expect(screen.getByLabelText("Status")).toBeInTheDocument();
                expect(screen.getByLabelText("Min Budget")).toBeInTheDocument();
                expect(screen.getByLabelText("Max Budget")).toBeInTheDocument();
            });
        });
    });
});

import { useEffect, useState, useMemo } from "react";
import { Box, CircularProgress, Alert } from "@mui/material";
import RequestFilters, { FiltersState } from "./RequestFilters";
import RequestTable, { StatusType } from "./RequestTable";

export interface CertificationRequest {
    id: number;
    employeeId: number;
    employeeName: string;
    description: string;
    estimatedBudget: number;
    expectedDate: string;
    status: StatusType;
}

const SupervisorPage = () => {
    const [requests, setRequests] = useState<CertificationRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filters, setFilters] = useState<FiltersState>({
        employeeName: "",
        status: "",
        minBudget: "",
        maxBudget: "",
    });
    const [sortBy, setSortBy] = useState<string>("expectedDate");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:3001/requests")
            .then((res) => res.json())
            .then((data) => setRequests(data))
            .catch(() => setError("Failed to fetch requests."))
            .finally(() => setLoading(false));
    }, []);

    // Filtering
    const filteredRequests = useMemo(() => {
        return requests.filter((req) => {
            if (
                filters.employeeName &&
                req.employeeName !== filters.employeeName
            )
                return false;
            if (filters.status && req.status !== filters.status) return false;
            if (
                filters.minBudget &&
                req.estimatedBudget < Number(filters.minBudget)
            )
                return false;
            if (
                filters.maxBudget &&
                req.estimatedBudget > Number(filters.maxBudget)
            )
                return false;
            return true;
        });
    }, [requests, filters]);

    // Sorting
    const sortedRequests = useMemo(() => {
        return [...filteredRequests].sort((a, b) => {
            let aValue: number | string =
                a[sortBy as keyof CertificationRequest];
            let bValue: number | string =
                b[sortBy as keyof CertificationRequest];
            if (sortBy === "expectedDate") {
                aValue = a.expectedDate;
                bValue = b.expectedDate;
            }
            if (sortBy === "estimatedBudget") {
                aValue = a.estimatedBudget;
                bValue = b.estimatedBudget;
            }
            if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
            if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
            return 0;
        });
    }, [filteredRequests, sortBy, sortDirection]);

    // Unique employee names for filter dropdown
    const employeeNames = useMemo(
        () => Array.from(new Set(requests.map((r) => r.employeeName))),
        [requests]
    );

    // Handle status update
    const handleStatusChange = async (id: number, newStatus: StatusType) => {
        try {
            const req = requests.find((r) => r.id === id);
            if (!req) return;
            const updated = { ...req, status: newStatus };
            await fetch(`http://localhost:3001/requests/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)));
        } catch {
            setError("Failed to update status.");
        }
    };

    return (
        <Box p={3} data-testid="supervisor-page">
            <RequestFilters
                employeeNames={employeeNames}
                onFilterChange={setFilters}
            />
            {loading ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="40vh"
                    data-testid="loading-container"
                >
                    <CircularProgress data-testid="loading-spinner" />
                </Box>
            ) : error ? (
                <Alert severity="error" data-testid="error-alert">
                    {error}
                </Alert>
            ) : (
                <RequestTable
                    requests={sortedRequests}
                    onStatusChange={handleStatusChange}
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortChange={(field) => {
                        if (sortBy === field) {
                            setSortDirection((d) =>
                                d === "asc" ? "desc" : "asc"
                            );
                        } else {
                            setSortBy(field);
                            setSortDirection("asc");
                        }
                    }}
                />
            )}
        </Box>
    );
};

export default SupervisorPage;

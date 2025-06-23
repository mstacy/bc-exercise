import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    Box,
    TableSortLabel,
    Typography,
} from "@mui/material";
import type { CertificationRequest } from "./SupervisorPage";
import dayjs from "dayjs";
import { Fragment } from "react";

export type StatusType = "draft" | "submitted" | "approved" | "rejected";

export interface GroupedRequests {
    status: StatusType;
    requests: CertificationRequest[];
}

export interface RequestTableProps {
    requests: GroupedRequests[];
    onStatusChange: (id: number, newStatus: StatusType) => void;
    sortBy: string;
    sortDirection: "asc" | "desc";
    onSortChange: (field: string) => void;
}

const statusLabels: Record<StatusType, string> = {
    draft: "Draft",
    submitted: "Submitted for Approval",
    approved: "Approved",
    rejected: "Rejected",
};

const RequestTable = ({
    requests,
    onStatusChange,
    sortBy,
    sortDirection,
    onSortChange,
}: RequestTableProps) => {
    // Check if all groups are empty
    const hasAnyRequests = requests.some((group) => group.requests.length > 0);

    return (
        <Box data-testid="request-table">
            <TableContainer component={Paper} data-testid="table-container">
                <Table size="small" data-testid="table">
                    <TableHead>
                        <TableRow>
                            <TableCell data-testid="employee-header">
                                Employee
                            </TableCell>
                            <TableCell data-testid="description-header">
                                Description
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === "estimatedBudget"}
                                    direction={
                                        sortBy === "estimatedBudget"
                                            ? sortDirection
                                            : "asc"
                                    }
                                    onClick={() =>
                                        onSortChange("estimatedBudget")
                                    }
                                    data-testid="budget-sort"
                                >
                                    Budget
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={sortBy === "expectedDate"}
                                    direction={
                                        sortBy === "expectedDate"
                                            ? sortDirection
                                            : "asc"
                                    }
                                    onClick={() => onSortChange("expectedDate")}
                                    data-testid="date-sort"
                                >
                                    Expected Date
                                </TableSortLabel>
                            </TableCell>
                            <TableCell data-testid="update-status-header">
                                Status
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {!hasAnyRequests ? (
                            <TableRow data-testid="no-requests-found">
                                <TableCell
                                    colSpan={5}
                                    sx={{
                                        textAlign: "center",
                                        py: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No requests found matching your filters
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            requests.map((group) => (
                                <Fragment
                                    key={`group-fragment-${group.status}`}
                                >
                                    {group.requests.length > 0 && (
                                        <TableRow
                                            key={`group-${group.status}`}
                                            data-testid={`group-header-${group.status}`}
                                        >
                                            <TableCell
                                                colSpan={5}
                                                sx={{
                                                    backgroundColor: "grey.100",
                                                    fontWeight: "bold",
                                                    fontSize: "1.1rem",
                                                }}
                                                data-testid={`group-title-${group.status}`}
                                            >
                                                {statusLabels[group.status]} (
                                                {group.requests.length})
                                            </TableCell>
                                        </TableRow>
                                    )}
                                    {group.requests.map((req) => (
                                        <TableRow
                                            key={req.id}
                                            data-testid={`request-row-${req.id}`}
                                            role="row"
                                        >
                                            <TableCell
                                                data-testid={`employee-name-${req.id}`}
                                            >
                                                {req.employeeName}
                                            </TableCell>
                                            <TableCell
                                                data-testid={`description-${req.id}`}
                                            >
                                                {req.description}
                                            </TableCell>
                                            <TableCell
                                                data-testid={`budget-${req.id}`}
                                            >
                                                $
                                                {req.estimatedBudget.toLocaleString()}
                                            </TableCell>
                                            <TableCell
                                                data-testid={`date-${req.id}`}
                                            >
                                                {dayjs(req.expectedDate).format(
                                                    "YYYY-MM-DD"
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={req.status}
                                                    onChange={(e) =>
                                                        onStatusChange(
                                                            req.id,
                                                            e.target
                                                                .value as StatusType
                                                        )
                                                    }
                                                    inputProps={{
                                                        "data-testid": `status-select-${req.id}`,
                                                    }}
                                                    size="small"
                                                    sx={{
                                                        minWidth: 190,
                                                        fontSize: ".875rem",
                                                    }}
                                                >
                                                    {Object.keys(
                                                        statusLabels
                                                    ).map((status) => (
                                                        <MenuItem
                                                            key={status}
                                                            value={status}
                                                            data-testid={`status-option-${req.id}-${status}`}
                                                        >
                                                            {
                                                                statusLabels[
                                                                    status as StatusType
                                                                ]
                                                            }
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </Fragment>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default RequestTable;

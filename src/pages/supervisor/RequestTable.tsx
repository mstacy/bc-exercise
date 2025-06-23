import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Select,
    MenuItem,
    Box,
    TableSortLabel,
    FormControl,
    InputLabel,
} from "@mui/material";
import type { CertificationRequest } from "./SupervisorPage";
import dayjs from "dayjs";

export type StatusType = "draft" | "submitted" | "approved" | "rejected";

export interface RequestTableProps {
    requests: CertificationRequest[];
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

const groupOrder: StatusType[] = ["draft", "submitted", "approved", "rejected"];

const RequestTable = ({
    requests,
    onStatusChange,
    sortBy,
    sortDirection,
    onSortChange,
}: RequestTableProps) => {
    // Group requests by status
    const grouped = groupOrder.map((status) => ({
        status,
        items: requests.filter((r) => r.status === status),
    }));

    return (
        <Box data-testid="request-table">
            {grouped.map((group) => (
                <Box
                    key={group.status}
                    mb={4}
                    data-testid={`status-group-${group.status}`}
                >
                    <Typography
                        variant="h6"
                        mb={1}
                        data-testid={`group-title-${group.status}`}
                    >
                        {statusLabels[group.status as StatusType]}
                    </Typography>
                    <TableContainer
                        component={Paper}
                        data-testid={`table-container-${group.status}`}
                    >
                        <Table
                            size="small"
                            data-testid={`table-${group.status}`}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell
                                        data-testid={`employee-header-${group.status}`}
                                    >
                                        Employee
                                    </TableCell>
                                    <TableCell
                                        data-testid={`description-header-${group.status}`}
                                    >
                                        Description
                                    </TableCell>
                                    <TableCell>
                                        <TableSortLabel
                                            active={
                                                sortBy === "estimatedBudget"
                                            }
                                            direction={
                                                sortBy === "estimatedBudget"
                                                    ? sortDirection
                                                    : "asc"
                                            }
                                            onClick={() =>
                                                onSortChange("estimatedBudget")
                                            }
                                            data-testid={`budget-sort-${group.status}`}
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
                                            onClick={() =>
                                                onSortChange("expectedDate")
                                            }
                                            data-testid={`date-sort-${group.status}`}
                                        >
                                            Expected Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell
                                        data-testid={`status-header-${group.status}`}
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        data-testid={`update-status-header-${group.status}`}
                                    >
                                        Update Status
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.items.map((req) => (
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
                                        <TableCell
                                            data-testid={`status-${req.id}`}
                                        >
                                            {statusLabels[req.status]}
                                        </TableCell>
                                        <TableCell>
                                            <FormControl
                                                size="small"
                                                variant="outlined"
                                            >
                                                <InputLabel>Status</InputLabel>
                                                <Select
                                                    value={req.status}
                                                    label="Status"
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
                                                >
                                                    {groupOrder.map(
                                                        (status) => (
                                                            <MenuItem
                                                                key={status}
                                                                value={status}
                                                                data-testid={`status-option-${req.id}-${status}`}
                                                            >
                                                                {
                                                                    statusLabels[
                                                                        status
                                                                    ]
                                                                }
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {group.items.length === 0 && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            mt={2}
                            data-testid={`empty-group-${group.status}`}
                        >
                            No requests in this group.
                        </Typography>
                    )}
                </Box>
            ))}
        </Box>
    );
};

export default RequestTable;

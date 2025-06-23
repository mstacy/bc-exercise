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
        <Box>
            {grouped.map((group) => (
                <Box key={group.status} mb={4}>
                    <Typography variant="h6" mb={1}>
                        {statusLabels[group.status as StatusType]}
                    </Typography>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Employee</TableCell>
                                    <TableCell>Description</TableCell>
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
                                        >
                                            Expected Date
                                        </TableSortLabel>
                                    </TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Update Status</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {group.items.map((req) => (
                                    <TableRow key={req.id}>
                                        <TableCell>
                                            {req.employeeName}
                                        </TableCell>
                                        <TableCell>{req.description}</TableCell>
                                        <TableCell>
                                            $
                                            {req.estimatedBudget.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            {dayjs(req.expectedDate).format(
                                                "YYYY-MM-DD"
                                            )}
                                        </TableCell>
                                        <TableCell>
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
                                                >
                                                    {groupOrder.map(
                                                        (status) => (
                                                            <MenuItem
                                                                key={status}
                                                                value={status}
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

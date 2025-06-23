import { Box, TextField, MenuItem, Stack, InputAdornment } from "@mui/material";
import { ChangeEvent, useState, useEffect } from "react";

export interface RequestFiltersProps {
    employeeNames: string[];
    onFilterChange: (filters: FiltersState) => void;
}

export interface FiltersState {
    employeeName: string;
    status: string;
    minBudget: string;
    maxBudget: string;
}

const RequestFilters = ({
    employeeNames,
    onFilterChange,
}: RequestFiltersProps) => {
    const [filters, setFilters] = useState<FiltersState>({
        employeeName: "",
        status: "",
        minBudget: "",
        maxBudget: "",
    });

    // Debounce filter changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            onFilterChange(filters);
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters, onFilterChange]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <Box mb={2} data-testid="request-filters">
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                    select
                    label="Employee Name"
                    name="employeeName"
                    value={filters.employeeName}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: 160 }}
                    inputProps={{
                        "data-testid": "employee-name-filter",
                    }}
                >
                    <MenuItem value="">All</MenuItem>
                    {employeeNames.map((name) => (
                        <MenuItem
                            data-testid={`employee-name-${name}`}
                            key={name}
                            value={name}
                        >
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    select
                    label="Status"
                    name="status"
                    value={filters.status}
                    onChange={handleChange}
                    size="small"
                    sx={{ minWidth: 160 }}
                    slotProps={{
                        select: {
                            inputProps: {
                                "data-testid": "status-filter",
                            },
                        },
                    }}
                >
                    <MenuItem value="" data-testid="status-option-all">
                        All
                    </MenuItem>
                    <MenuItem value="draft" data-testid="status-option-draft">
                        Draft
                    </MenuItem>
                    <MenuItem
                        value="submitted"
                        data-testid="status-option-submitted"
                    >
                        Submitted for Approval
                    </MenuItem>
                    <MenuItem
                        value="approved"
                        data-testid="status-option-approved"
                    >
                        Approved
                    </MenuItem>
                    <MenuItem
                        value="rejected"
                        data-testid="status-option-rejected"
                    >
                        Rejected
                    </MenuItem>
                </TextField>
                <TextField
                    label="Min Budget"
                    name="minBudget"
                    value={filters.minBudget}
                    onChange={handleChange}
                    size="small"
                    type="number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                        ),
                        inputProps: {
                            min: 0,
                            step: 0.01,
                            "data-testid": "min-budget-filter",
                        },
                    }}
                    sx={{ minWidth: 120 }}
                />
                <TextField
                    label="Max Budget"
                    name="maxBudget"
                    value={filters.maxBudget}
                    onChange={handleChange}
                    size="small"
                    type="number"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">$</InputAdornment>
                        ),
                        inputProps: {
                            min: 0,
                            step: 0.01,
                            "data-testid": "max-budget-filter",
                        },
                    }}
                    sx={{ minWidth: 120 }}
                />
            </Stack>
        </Box>
    );
};

export default RequestFilters;

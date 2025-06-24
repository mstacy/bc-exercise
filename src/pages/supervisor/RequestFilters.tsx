import {
    Box,
    TextField,
    MenuItem,
    Stack,
    InputAdornment,
    Alert,
    Button,
} from "@mui/material";
import { ChangeEvent, useState, useEffect, useMemo } from "react";

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

const initialFilters: FiltersState = {
    employeeName: "",
    status: "",
    minBudget: "",
    maxBudget: "",
};

const RequestFilters = ({
    employeeNames,
    onFilterChange,
}: RequestFiltersProps) => {
    const [filters, setFilters] = useState<FiltersState>(initialFilters);

    // Cached budget validation
    const budgetValidation = useMemo(() => {
        const { minBudget, maxBudget } = filters;

        if (minBudget && maxBudget) {
            const min = parseFloat(minBudget);
            const max = parseFloat(maxBudget);

            if (isNaN(min) || isNaN(max)) {
                return { isValid: true, error: "" };
            }

            if (min > max) {
                return {
                    isValid: false,
                    error: "Minimum budget cannot be greater than maximum budget",
                };
            }
        }

        return { isValid: true, error: "" };
    }, [filters.minBudget, filters.maxBudget]);

    // Debounce filter changes
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (budgetValidation.isValid) {
                onFilterChange(filters);
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [filters, onFilterChange, budgetValidation.isValid]);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters(initialFilters);
        onFilterChange(initialFilters);
    };

    return (
        <Box mb={2} data-testid="request-filters">
            <Stack
                direction={{ xs: "row" }}
                alignItems="flex-end"
                flexWrap="wrap"
                gap={2}
            >
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
                    error={!budgetValidation.isValid}
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
                    error={!budgetValidation.isValid}
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
                <Button
                    variant="outlined"
                    onClick={handleReset}
                    sx={{ height: 40 }}
                    data-testid="reset-filters"
                >
                    Reset
                </Button>
            </Stack>
            {budgetValidation.error && (
                <Alert
                    severity="error"
                    sx={{ mb: 2, mt: 1 }}
                    data-testid="budget-error"
                >
                    {budgetValidation.error}
                </Alert>
            )}
        </Box>
    );
};

export default RequestFilters;

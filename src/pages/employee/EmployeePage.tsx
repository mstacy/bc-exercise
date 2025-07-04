import { useForm, Controller, useWatch } from "react-hook-form";
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useState, useEffect } from "react";
import { useUser } from "../../auth/UserContext";

interface CertFormData {
    description: string;
    budget: number | "";
    expectedDate: Dayjs | null;
}

interface CertificationRequest {
    employeeId: number;
    employeeName: string;
    description: string;
    estimatedBudget: number;
    expectedDate: string;
    status: "submitted" | "draft" | "approved" | "rejected";
}

const MAX_DESCRIPTION_LENGTH = 360;

const EmployeePage = () => {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const { user } = useUser();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
        clearErrors,
    } = useForm<CertFormData>({
        defaultValues: {
            description: "",
            budget: "",
            expectedDate: null,
        },
        mode: "onBlur",
    });

    const descriptionValue = useWatch({ control, name: "description" });

    const onSubmit = async (data: CertFormData) => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            if (!user) throw new Error("User not found");
            const username =
                user.username.charAt(0) !==
                user.username.charAt(0).toUpperCase()
                    ? user.username.charAt(0).toUpperCase() +
                      user.username.slice(1)
                    : user.username;
            const request: CertificationRequest = {
                employeeId: user.id,
                employeeName: username,
                description: data.description,
                estimatedBudget: Number(data.budget),
                expectedDate: data.expectedDate
                    ? data.expectedDate.format("YYYY-MM-DD")
                    : "",
                status: "submitted",
            };
            const response = await fetch("http://localhost:3001/requests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                throw new Error("Failed to submit request");
            }
            setSuccess(true);
            reset();
        } catch (e: any) {
            setError(e.message || "Submission failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Hide success alert after 10 seconds
    useEffect(() => {
        if (!success) return;
        const timer = setTimeout(() => setSuccess(false), 10000);
        return () => clearTimeout(timer);
    }, [success]);

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            minHeight="80vh"
            mt={4}
            data-testid="employee-page"
        >
            <Card
                sx={{ width: 500, p: 2 }}
                data-testid="certification-form-card"
            >
                <CardContent>
                    <Typography
                        variant="h5"
                        fontWeight={600}
                        mb={2}
                        data-testid="page-title"
                    >
                        Certification Request
                    </Typography>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        noValidate
                        data-testid="certification-form"
                    >
                        <Stack spacing={3}>
                            <Controller
                                name="description"
                                control={control}
                                rules={{
                                    required: "Description is required",
                                    maxLength: {
                                        value: MAX_DESCRIPTION_LENGTH,
                                        message: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters`,
                                    },
                                }}
                                render={({ field }) => (
                                    <>
                                        <TextField
                                            {...field}
                                            label="Description"
                                            multiline
                                            minRows={3}
                                            required
                                            error={!!errors.description}
                                            helperText={
                                                errors.description?.message ? (
                                                    <span data-testid="description-error">
                                                        {
                                                            errors.description
                                                                .message
                                                        }
                                                    </span>
                                                ) : null
                                            }
                                            disabled={loading || isSubmitting}
                                            fullWidth
                                            inputProps={{
                                                "data-testid":
                                                    "description-field",
                                            }}
                                        />
                                        <Box
                                            textAlign="right"
                                            color="text.secondary"
                                            fontSize={13}
                                            sx={{
                                                marginTop: `0 !important`,
                                            }}
                                            data-testid="description-char-count"
                                        >
                                            {`${
                                                (descriptionValue || "").length
                                            } / ${MAX_DESCRIPTION_LENGTH}`}
                                        </Box>
                                    </>
                                )}
                            />
                            <Controller
                                name="budget"
                                control={control}
                                rules={{
                                    required: "Estimated budget is required",
                                    validate: (v) => {
                                        if (v === "" || Number(v) <= 0) {
                                            return "Budget must be a positive number";
                                        }
                                        if (Number(v) > 100000) {
                                            return "Budget cannot exceed $100,000";
                                        }
                                        return true;
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Estimated Budget"
                                        type="number"
                                        required
                                        error={!!errors.budget}
                                        helperText={
                                            errors.budget?.message ? (
                                                <span data-testid="budget-error">
                                                    {errors.budget.message}
                                                </span>
                                            ) : null
                                        }
                                        disabled={loading || isSubmitting}
                                        fullWidth
                                        InputProps={{
                                            startAdornment: (
                                                <span
                                                    style={{ marginRight: 4 }}
                                                >
                                                    $
                                                </span>
                                            ),
                                            inputProps: {
                                                min: 0,
                                                max: 100000,
                                                step: 0.01,
                                                "data-testid": "budget-field",
                                            },
                                        }}
                                    />
                                )}
                            />
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Controller
                                    name="expectedDate"
                                    control={control}
                                    rules={{
                                        required: "Expected date is required",
                                        validate: (v) =>
                                            (v &&
                                                (v.isAfter(
                                                    dayjs().subtract(1, "day"),
                                                    "day"
                                                ) ||
                                                    v.isSame(
                                                        dayjs(),
                                                        "day"
                                                    ))) ||
                                            "Date must be today or later",
                                    }}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            label="Expected Date"
                                            minDate={dayjs()}
                                            disablePast
                                            slotProps={{
                                                textField: {
                                                    required: true,
                                                    error: !!errors.expectedDate,
                                                    helperText:
                                                        errors.expectedDate
                                                            ?.message,
                                                    disabled:
                                                        loading || isSubmitting,
                                                    fullWidth: true,
                                                    inputProps: {
                                                        "data-testid":
                                                            "date-field",
                                                    },
                                                },
                                            }}
                                            value={field.value}
                                            onChange={(date) =>
                                                field.onChange(date)
                                            }
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                            {error && (
                                <Alert
                                    severity="error"
                                    data-testid="error-alert"
                                >
                                    {error}
                                </Alert>
                            )}
                            {success && (
                                <Alert
                                    severity="success"
                                    data-testid="success-alert"
                                >
                                    Request submitted successfully!
                                </Alert>
                            )}
                            <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                                data-testid="form-actions"
                            >
                                <Button
                                    onClick={() => reset()}
                                    disabled={loading || isSubmitting}
                                    variant="outlined"
                                    data-testid="clear-button"
                                >
                                    Clear
                                </Button>
                                <Button
                                    onClick={() => {
                                        reset();
                                        clearErrors();
                                        setSuccess(false);
                                        setError("");
                                    }}
                                    disabled={loading || isSubmitting}
                                    variant="outlined"
                                    data-testid="reset-button"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || isSubmitting}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress
                                                size={18}
                                                data-testid="submit-loading"
                                            />
                                        ) : null
                                    }
                                    data-testid="submit-button"
                                >
                                    Submit
                                </Button>
                            </Stack>
                        </Stack>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
};

export default EmployeePage;

import { useForm, Controller } from "react-hook-form";
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
import { useState } from "react";
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

    const onSubmit = async (data: CertFormData) => {
        setLoading(true);
        setError("");
        setSuccess(false);
        try {
            if (!user) throw new Error("User not found");
            const request: CertificationRequest = {
                employeeId: user.id,
                employeeName: user.username,
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
            console.log({ response });
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

    const handleClear = () => {
        reset();
        clearErrors();
        setSuccess(false);
        setError("");
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            minHeight="80vh"
            mt={4}
        >
            <Card sx={{ width: 500, p: 2 }}>
                <CardContent>
                    <Typography variant="h5" fontWeight={600} mb={2}>
                        Certification Request
                    </Typography>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <Stack spacing={3}>
                            <Controller
                                name="description"
                                control={control}
                                rules={{ required: "Description is required" }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Description"
                                        multiline
                                        minRows={3}
                                        required
                                        error={!!errors.description}
                                        helperText={errors.description?.message}
                                        disabled={loading || isSubmitting}
                                        fullWidth
                                    />
                                )}
                            />
                            <Controller
                                name="budget"
                                control={control}
                                rules={{
                                    required: "Estimated budget is required",
                                    validate: (v) =>
                                        (v !== "" && Number(v) > 0) ||
                                        "Budget must be a positive number",
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        label="Estimated Budget"
                                        type="number"
                                        required
                                        error={!!errors.budget}
                                        helperText={errors.budget?.message}
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
                                            inputProps: { min: 0, step: 0.01 },
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
                            {error && <Alert severity="error">{error}</Alert>}
                            {success && (
                                <Alert severity="success">
                                    Request submitted successfully!
                                </Alert>
                            )}
                            <Stack
                                direction="row"
                                spacing={2}
                                justifyContent="flex-end"
                            >
                                <Button
                                    onClick={handleClear}
                                    disabled={loading || isSubmitting}
                                    variant="outlined"
                                >
                                    Clear
                                </Button>
                                <Button
                                    onClick={() => {
                                        reset();
                                        setSuccess(false);
                                        setError("");
                                    }}
                                    disabled={loading || isSubmitting}
                                    variant="outlined"
                                >
                                    Reset
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || isSubmitting}
                                    startIcon={
                                        loading ? (
                                            <CircularProgress size={18} />
                                        ) : null
                                    }
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

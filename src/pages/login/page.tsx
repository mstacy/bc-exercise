import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    Container,
    Paper,
    Divider,
} from "@mui/material";
import {
    LockOutlined,
    Person,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import { IconButton, InputAdornment } from "@mui/material";

interface LoginFormData {
    username: string;
    password: string;
}

interface User {
    username: string;
    role: "employee" | "supervisor";
}

const LoginPage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LoginFormData>({
        defaultValues: {
            username: "",
            password: "",
        },
    });

    // Fake authentication function
    const authenticateUser = async (
        username: string,
        password: string
    ): Promise<User | null> => {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Fake user database
        const users: User[] = [
            { username: "employee1", role: "employee" },
            { username: "employee2", role: "employee" },
            { username: "supervisor1", role: "supervisor" },
            { username: "supervisor2", role: "supervisor" },
        ];

        // Simple authentication logic
        const user = users.find((u) => u.username === username);

        if (user && password === "password123") {
            return user;
        }

        return null;
    };

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError("");

        try {
            const user = await authenticateUser(data.username, data.password);

            if (user) {
                // Store user info in localStorage (in a real app, you'd use a more secure method)
                localStorage.setItem("user", JSON.stringify(user));

                // Redirect based on role
                if (user.role === "employee") {
                    navigate("/employee");
                } else {
                    navigate("/supervisor");
                }
            } else {
                setError("Invalid username or password");
                reset();
            }
        } catch (err) {
            setError("An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleTogglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    py: 4,
                }}
            >
                <Card
                    elevation={8}
                    sx={{
                        width: "100%",
                        maxWidth: 400,
                        borderRadius: 3,
                    }}
                >
                    <CardContent sx={{ p: 4 }}>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                mb: 3,
                            }}
                        >
                            <Box
                                sx={{
                                    backgroundColor: "primary.main",
                                    borderRadius: "50%",
                                    p: 1,
                                    mb: 2,
                                }}
                            >
                                <LockOutlined
                                    sx={{ color: "white", fontSize: 32 }}
                                />
                            </Box>
                            <Typography
                                component="h1"
                                variant="h4"
                                fontWeight="bold"
                            >
                                Sign In
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 1 }}
                            >
                                Please sign in to continue
                            </Typography>
                        </Box>

                        <Box
                            component="form"
                            onSubmit={handleSubmit(onSubmit)}
                            noValidate
                        >
                            <Controller
                                name="username"
                                control={control}
                                rules={{
                                    required: "Username is required",
                                    minLength: {
                                        value: 3,
                                        message:
                                            "Username must be at least 3 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Username"
                                        autoComplete="username"
                                        autoFocus
                                        error={!!errors.username}
                                        helperText={errors.username?.message}
                                        disabled={isLoading}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Person color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                rules={{
                                    required: "Password is required",
                                    minLength: {
                                        value: 6,
                                        message:
                                            "Password must be at least 6 characters",
                                    },
                                }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        id="password"
                                        autoComplete="current-password"
                                        error={!!errors.password}
                                        helperText={errors.password?.message}
                                        disabled={isLoading}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={
                                                            handleTogglePasswordVisibility
                                                        }
                                                        edge="end"
                                                    >
                                                        {showPassword ? (
                                                            <VisibilityOff />
                                                        ) : (
                                                            <Visibility />
                                                        )}
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                )}
                            />

                            {error && (
                                <Alert severity="error" sx={{ mt: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    fontSize: "1.1rem",
                                    fontWeight: "bold",
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <CircularProgress
                                        size={24}
                                        color="inherit"
                                    />
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </Box>

                        <Divider sx={{ my: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Demo Credentials
                            </Typography>
                        </Divider>

                        <Paper
                            variant="outlined"
                            sx={{ p: 2, bgcolor: "grey.50" }}
                        >
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                gutterBottom
                            >
                                <strong>Employee:</strong> alice / password123
                                <br />
                                <strong>Employee:</strong> bob / password123
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                <strong>Supervisor:</strong> carol / adminpass
                            </Typography>
                        </Paper>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
};

export default LoginPage;

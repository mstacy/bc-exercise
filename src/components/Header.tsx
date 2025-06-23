import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useUser } from "../auth/UserContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        setUser(null);
        navigate("/login");
    };

    return (
        <AppBar position="static" color="primary" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    FE Module Exercise
                </Typography>
                {user && (
                    <Box display="flex" alignItems="center" gap={2}>
                        <Typography variant="body1">
                            {user.username} ({user.role})
                        </Typography>
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            variant="outlined"
                            sx={{ ml: 2 }}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Header;

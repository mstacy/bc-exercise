import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate("/login");
    }, [navigate]);

    return <></>;
};

export default HomePage;

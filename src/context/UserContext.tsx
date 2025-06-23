import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";

export interface User {
    id: number;
    username: string;
    role: "employee" | "supervisor";
    token: string;
}

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUserState] = useState<User | null>(null);

    // Load user from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("user");
        console.log({ stored });
        if (stored) {
            try {
                setUserState(JSON.parse(stored));
            } catch {
                setUserState(null);
            }
        }
    }, []);

    // Sync setUser with localStorage
    const setUser = (user: User | null) => {
        setUserState(user);
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        } else {
            localStorage.removeItem("user");
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

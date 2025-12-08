import { createContext, useState } from "react";
import { getMe, logout } from "../api/auth";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext({
    value: null,
    onFetch: () => { },
    onLogin: () => { },
    onLogout: () => { },
});

export default function UserProvider(props) {
    const [user, setUser] = useState(null);
    const navigateTo = useNavigate();

    return <UserContext.Provider value={{
        value: user,
        onLogin: (v) => setUser(v),
        onLogout: async () => {
            if (!(await logout()).error) {
                setUser(null);
                navigateTo("/signin");
            }
        },
        onFetch: async () => {
            setUser(null);
            const res = await getMe();
            if (!res.error) {
                setUser(res);
            } else {
                setUser({ notLogin: true });
            }
        }
    }}>
        {props.children}
    </UserContext.Provider>
}
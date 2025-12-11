import { createContext, useState } from "react";
import { getMe, logout } from "../api/auth";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProjects } from "../api/project";

export const UserContext = createContext({
    value: null,
    onFetch: () => { },
    onLogin: () => { },
    onLogout: () => { },
});

export default function UserProvider(props) {
    const { id } = useParams();
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
        onFetch: async (index = 0, id) => {
            setUser(null);
            const me = await getMe();
            const project = await fetchProjects();
            let data;
            if (id !== undefined) {
                data = project.data.find(p => p.id === id);
                data.isMine = false;
            } else {
                data = project.data[index];
                data.isMine = index === 0;
            }
            const res = {
                ...me,
                project: data
            }
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
import { AccountCircle, Description, Mail, More, Notifications } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Header() {
    const navigateTo = useNavigate();
    const location = useLocation();
    const user = useContext(UserContext);
    const [t, setT] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {

        const path = location.pathname;
        const match = path.match(/^\/projects\/([^\/]+)/); // захватываем всё после /projects/ до следующего /
        const urlProjectId = match ? match[1] : null;
        if (urlProjectId) {
            user.onFetch(0, urlProjectId)
        } else if (user.value === null) {
            user.onFetch();
        }
    }, []);

    useEffect(() => {
        if (user.value?.project.isMine) return;
        const data = {
            name: user.value?.project.name,
            description: user.value?.project.description,
            id: user.value?.project.id
        }
        console.log('data', data)
        setSelectedProject(data);
    }, [user.value?.project.id])

    useEffect(() => {
        if (!["/signin", "/signup"].includes(location.pathname)) {
            if (user.value !== null && user.value.notLogin) {
                navigateTo("/signin");
            }
        }
    }, [location, user])

    function handleSignin(ev) {
        if (user.value) {
            setT(ev.currentTarget);
        } else {
            navigateTo("/signin");
        }
    }

    return <AppBar position="static">
        <Toolbar>
            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ display: { xs: 'none', sm: 'block' }, mr: 2, fontWeight: "bold" }}
            >
                <Link to="/" style={{ all: "unset", cursor: "pointer" }}>STUDENT TODO</Link>
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                {!selectedProject?.name &&
                    <Link to="/projects">
                        <Button key="d" sx={{ color: '#fff' }}>
                            Проекты
                        </Button>
                    </Link>
                }
                {selectedProject?.name &&
                    <Link to={`/projects/${selectedProject?.id}`}>
                        <Button key="d" sx={{ color: '#fff' }}>
                            Проект: {selectedProject?.name}
                        </Button>
                    </Link>
                }
                <Link to="/todo">
                    <Button key="d" sx={{ color: '#fff' }}>
                        Задачи
                    </Button>
                </Link>
                <Link to="/notes">
                    <Button key="d" sx={{ color: '#fff' }}>
                        Заметки
                    </Button>
                </Link>
                {selectedProject?.name &&
                    <Link to="/members">
                        <Button key="d" sx={{ color: '#fff' }}>
                            Участники
                        </Button>
                    </Link>
                }
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'flex' } }}>
                <Button key="d" sx={{ color: '#fff' }} onClick={(ev) => {
                    handleSignin(ev)
                    console.log(user.value)
                }
                }>
                    {user.value ? user.value.username : "Войти"}
                </Button>
                <Menu
                    id="menu-appbar"
                    anchorEl={t}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(t)}
                    onClose={() => setT(null)}
                >
                    <MenuItem onClick={() => {
                        user.onLogout();
                        setT(null);
                    }}>Выйти</MenuItem>
                </Menu>
            </Box>
        </Toolbar>
    </AppBar>
}
import { AccountCircle, Mail, More, Notifications } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

export default function Header() {
    const navigateTo = useNavigate();
    const location = useLocation();
    const user = useContext(UserContext);
    const [t, setT] = useState(null)

    useEffect(() => {
        if (user.value === null) {
            user.onFetch();
        }
    }, []);

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
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'flex' } }}>
                <Button key="d" sx={{ color: '#fff' }} onClick={(ev) => handleSignin(ev)}>
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
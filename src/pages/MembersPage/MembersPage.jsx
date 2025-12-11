import { AccountCircle, Mail, More, Notifications, Search } from "@mui/icons-material";
import {
    AppBar,
    Badge,
    Box,
    Button,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    TextField,
    Toolbar,
    Typography,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { fetchMembers, addUser } from "../../api/project";
import Header from "../../components/Header/Header";
import MemberList from "../../components/Member/Member";
import FloatingActionButton from "../../components/FloatingButton/FloatingButton";
import MemberModal from "../../components/MemberModal/MemberModal";
import { getUserByLogin } from "../../api/user"

export default function MembersPage() {
    const navigateTo = useNavigate();
    const location = useLocation();
    const user = useContext(UserContext);

    const [members, setMembers] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
    const [t, setT] = useState(null);

    useEffect(() => {
        const projectId = user.value?.project.id;
        if (!projectId) return;

        fetchMembers(projectId)
            .then((response) => {
                setMembers(response.data || response || []);
            })
        console.log(user.value?.login)
    }, [user.value?.project?.id]);

    useEffect(() => {
        if (!["/signin", "/signup"].includes(location.pathname)) {
            if (user.value !== null && user.value.notLogin) {
                navigateTo("/signin");
            }
        }
    }, [location, user]);

    function handleSignin(ev) {
        if (user.value) {
            setT(ev.currentTarget);
        } else {
            navigateTo("/signin");
        }
    }

    const filteredMembers = members
        ? members.filter((member) =>
            [member.name, member.email, member.username]
                .filter(Boolean)
                .some((field) =>
                    field.toLowerCase().includes(searchQuery.toLowerCase())
                )
        )
        : [];

    const handleAddMember = async (formData) => {
        console.log("Добавить участника:", formData);
        const userData = await getUserByLogin(formData.name)
        await addUser(user.value?.project.id, userData.data.id)
        fetchMembers(user.value?.project.id)
            .then((response) => {
                console.log(response)
                setMembers(response.data || response || []);
            })
        setAddMemberModalOpen(false);
    };

    return (
        <Box
            sx={{
                minWidth: 300,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                maxHeight: "100%",
                overflow: "hidden",
            }}
        >
            <Header />

            {/* Панель управления */}
            <Box sx={{ p: 2, pb: 1, display: "flex", gap: 2, alignItems: "center" }}>
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Поиск участников..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search fontSize="small" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ flexGrow: 1, maxWidth: 400 }}
                />

                <Button
                    variant="contained"
                    onClick={() => setAddMemberModalOpen(true)}
                    sx={{ whiteSpace: "nowrap" }}
                >
                    Добавить участника
                </Button>
            </Box>

            {/* Список участников */}
            <Box sx={{ flexGrow: 1, overflow: "auto", p: 2 }}>
                <MemberList members={filteredMembers} />
            </Box>

            {/* Модальное окно добавления */}
            <MemberModal
                opened={addMemberModalOpen}
                onClose={() => setAddMemberModalOpen(false)}
                onAdd={handleAddMember}
            />

            {/* Меню профиля (если использовалось) */}
            <Menu
                id="menu-appbar"
                anchorEl={t}
                open={Boolean(t)}
                onClose={() => setT(null)}
            >
                <MenuItem onClick={() => {
                    user.onLogout();
                    setT(null);
                }}>
                    Выйти
                </MenuItem>
            </Menu>
        </Box>
    );
}
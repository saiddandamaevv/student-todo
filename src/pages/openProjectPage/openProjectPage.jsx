// src/pages/ProjectOverview/ProjectOverview.jsx
import { Box, Typography, Paper, Divider, Avatar, Chip, IconButton } from "@mui/material";
import { AccountCircle, Close } from "@mui/icons-material";
import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { UserContext } from "../../context/UserContext";
import { getProject } from "../../api/project";

export default function OpenProjectPage() {
    const navigate = useNavigate();
    const { projectId } = useParams();
    const user = useContext(UserContext);

    const [project, setProject] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        setError(null);
        getProject(user.value?.project.id)
            .then((response) => {
                const data = response.data;
                setProject(data);
            })
    }, []);

    useEffect(() => {
        setError(null);
        getProject(user.value?.project.id)
            .then((response) => {
                const data = response.data;
                setProject(data);
            })
    }, [user.value?.project.id]);

    useEffect(() => {
        if (projectId && user.value?.project?.id !== Number(projectId)) {
            user.onSetProjectId?.(Number(projectId));
        }
    }, [projectId, user]);

    const handleLeaveProject = () => {
        user.onFetch();
        navigate(`/projects`)
        console.log("Покинуть проект");
    };

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Header />
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }
    
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("ru-RU", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <Box
            sx={{
                minWidth: 300,
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                overflow: "hidden",
            }}
        >
            <Header />

            <Box sx={{ p: 3, overflow: "auto", flexGrow: 1 }}>
                <Paper
                    elevation={2}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        maxWidth: 800,
                        mx: "auto",
                        bgcolor: "background.paper",
                        position: "relative",
                        overflow: 'hidden',
                    }}
                >
                    <IconButton
                        onClick={handleLeaveProject}
                        sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            color: "text.secondary",
                            "&:hover": {
                                bgcolor: "error.dark",
                                color: "common.white",
                            },
                        }}
                        title="Покинуть проект"
                    >
                        <Close />
                    </IconButton>

                    <Typography variant="h4" fontWeight="bold" gutterBottom 
                    sx={{
                        whiteSpace: "pre-line"
                    }}>
                        {project?.name}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Typography 
                        variant="body1" 
                        paragraph
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 5,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {project?.description || "Описание отсутствует."}
                    </Typography>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Владелец
                            </Typography>
                            <Chip
                                avatar={
                                    <Avatar>
                                        <AccountCircle />
                                    </Avatar>
                                }
                                label={"Не указан"}
                                variant="outlined"
                                sx={{ mt: 1 }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" color="text.secondary">
                                Дата создания
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 1 }}>
                                {formatDate(project?.created_at)}
                            </Typography>
                        </Box>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
}   
import { AccountCircle, Mail, More, Notifications } from "@mui/icons-material";
import { AppBar, Badge, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { fetchMembers } from "../../api/project";
import Header from "../../components/Header/Header";
import Project from "../../components/Project/Project";
import FloatingActionButton from "../../components/FloatingButton/FloatingButton";
import ProjectModal from "../../components/ProjectModal/ProjectModal";
import { fetchProjects, createProject } from "../../api/project";



export default function ProjectsPage() {
    // const { id } = useParams();
    const navigate = useNavigate();

    const [createProjectModal, openCreateProjectModal] = React.useState(false);

    const [projects, setProjects] = useState([])
    const user = useContext(UserContext);

    useEffect(() => {
        fetchProjects().then((response) => {
            setProjects(response.data.slice(1));
        })
    }, []);

    async function handleCreateProject(form) {
        const { error, project } = await createProject(form);
        console.log('Create project result:', { error, project });

        if (!error && project) {
            setProjects(prev => {
                const currentArray = Array.isArray(prev) ? prev : [];
                return [...currentArray, project];
            });
            openCreateProjectModal(false);
        }
    }

    async function changeProject(index, projectId) {
        user.onFetch(index + 1)
        navigate(`/projects/${projectId}`);
    }

    return (<Box
        sx={{
            minWidth: 300,
            flexGrow: 1,
            maxHeight: "100%",
        }}
    >
        <Header />
        {projects.map((project, index) => {
            return (
                <Project
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    description={project.description}
                    change={changeProject}
                    index={index}
                />
            )
        })}

        <FloatingActionButton onClick={() => openCreateProjectModal(true)} />

        <ProjectModal
            new
            opened={createProjectModal}
            onCreate={(form) => handleCreateProject(form)}
            onClose={() => openCreateProjectModal(false)}
        />
    </Box>

    )
}
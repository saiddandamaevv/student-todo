import { Box, Button, ButtonGroup, Checkbox, Typography } from "@mui/material";
import Header from "../../components/Header/Header";
import "./styles.scss";
import React, { useMemo, useState } from "react";
import TodoSubList from "../../components/TodoSubList/TodoSubList";
import { createTask, fetchTasks, removeTask, updateTask, updateTaskStatus } from "../../api/tasks";
import TaskModal from "../../components/TaskModal/TaskModal";
import { useQueryParam, NumberParam, StringParam } from 'use-query-params';
import { useSearchParams } from "react-router-dom";
import { CheckBox } from "@mui/icons-material";

function useSortedTasks([tasks, sortingType]) {
    return useMemo(() => {
        console.log("Updated!");

        if (!tasks) return tasks;

        tasks.waiting.sort((a, b) => {
            console.log(a, b);
            const vA = sortingType === "i" ? b.importance : a.endDate.getTime();
            const vB = sortingType === "i" ? a.importance : b.endDate.getTime();
            return vA - vB;
        });

        tasks.in_progress.sort((a, b) => {
            const vA = sortingType === "i" ? b.importance : a.endDate.getTime();
            const vB = sortingType === "i" ? a.importance : b.endDate.getTime();
            return vA - vB;
        });

        tasks.completed.sort((a, b) => {
            const vA = sortingType === "i" ? b.importance : a.endDate.getTime();
            const vB = sortingType === "i" ? a.importance : b.endDate.getTime();
            return vA - vB;
        });

        return {
            waiting: [...tasks.waiting],
            in_progress: [...tasks.in_progress],
            completed: [...tasks.completed],
        };
    }, [tasks, sortingType]);
}

export default function TodoPage() {
    const [tasks, setTasks] = React.useState(null);
    const [draggableTask, setDraggableTask] = React.useState(null);
    const [editTask, setEditTask] = React.useState(null);

    const [createTaskModal, openCreateTaskModal] = React.useState(false);
    const [editTaskModal, openEditTaskModal] = React.useState(false);

    const [sorting, setSorting] = useSearchParams();
    const [update, setUpdate] = useState(0);
    const sortType = useMemo(() => sorting.get("s"), [sorting]);

    const sortedTasks = useSortedTasks([tasks, sortType]);

    React.useEffect(() => {
        fetchTasks().then((tasks) => setTasks(tasks.data));
        const id = setInterval(() => setUpdate(prev => prev + 1), 10000);
        return () => clearInterval(id);
    }, []);

    async function handleCreateTask(form) {
        const { error, task } = await createTask(form);
        if (!error) {
            tasks[task.state].push(task);
            setTasks(prev => ({
                ...prev,
            }));
        }
    }

    function handleDropTask(tasksListName) {
        updateTaskStatus(draggableTask.id, tasksListName);
        setTasks(prev => ({
            ...prev,
            [tasksListName]: [
                ...prev[tasksListName],
                {
                    ...draggableTask,
                    state: tasksListName,
                }
            ],
            [draggableTask.state]: prev[draggableTask.state].filter((E) => E.id !== draggableTask.id)
        }));
        setDraggableTask(null);
    }

    async function handleChangeTask(form) {
        const newData = { ...editTask, ...form };
        const { error } = await updateTask(editTask.id, newData);
        if (!error) {
            setTasks(prev => ({
                ...prev,
                [editTask.state]: prev[editTask.state].map((task) => {
                    return task.id === editTask.id ? newData : task;
                }),
            }));
        }
    }

    async function handleDeleteTask(id) {
        const { error } = await removeTask(id);
        if (!error) {
            setTasks(prev => ({
                ...prev,
                [editTask.state]: prev[editTask.state].filter((task) => task.id !== id),
            }));
        }
    }

    function handleChangeSort(t, e) {
        setSorting("s=" + (t ?? sorting.get("s") ?? "t") + "&e=" + (e ?? sorting.get("e") ?? "true"));
    }

    return <Box
        sx={{
            minWidth: 300,
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            maxHeight: "100%",
            overflow: "hidden"
        }}
    >
        <Header />
        <Box className="actions" sx={{ padding: 2, paddingBottom: 0 }}>
            <Button variant="outlined" onClick={() => openCreateTaskModal(true)}>Создать задачу</Button>
            <div className="full">
                <Checkbox
                    id="fullInfo"
                    onClick={(c) => handleChangeSort(null, c.target.checked)}
                    defaultChecked={(sorting.get("e") ?? false) == "true"}
                />
                <label for="fullInfo">Показывать подробности</label>
            </div>
            <div className="sort">
                <Typography>Сортировать по: </Typography>
                <ButtonGroup onClick={(ev) => handleChangeSort(ev.target.name)}>
                    <Button name="t" variant={(!sortType || sortType === "t") ? "contained" : "outlined"}>
                        Времени окончания
                    </Button>
                    <Button name="i" variant={sortType === "i" ? "contained" : "outlined"}>Приоритету</Button>
                </ButtonGroup>
            </div>
        </Box>
        {tasks && <Box className="todo-lists" sx={{
            p: 2,
            gap: 2,
        }}>
            <TodoSubList
                showProgress
                title="В ожидании"
                name="waiting"
                nowTask={{ draggableTask, setDraggableTask }}
                tasks={sortedTasks.waiting}
                onChange={(name) => handleDropTask(name)}
                onTaskClick={(task) => {
                    setEditTask(task);
                    openEditTaskModal(true);
                }}
                showFull={(sorting.get("e") ?? false) == "true"}
            />
            <TodoSubList
                showProgress
                title="В процессе"
                name="in_progress"
                nowTask={{ draggableTask, setDraggableTask }}
                tasks={sortedTasks.in_progress}
                onChange={(name) => handleDropTask(name)}
                onTaskClick={(task) => {
                    setEditTask(task);
                    openEditTaskModal(true);
                }}
                showFull={(sorting.get("e") ?? false) == "true"}
            />
            <TodoSubList
                title="Закончены"
                name="completed"
                nowTask={{ draggableTask, setDraggableTask }}
                tasks={sortedTasks.completed}
                onChange={(name) => handleDropTask(name)}
                onTaskClick={(task) => {
                    setEditTask(task);
                    openEditTaskModal(true);
                }}
                showFull={(sorting.get("e") ?? false) == "true"}
            />

            <TaskModal
                opened={editTaskModal}
                task={editTask}
                onChange={(form) => handleChangeTask(form)}
                onDelete={() => handleDeleteTask(editTask.id)}
                onClose={() => openEditTaskModal(false)}
            />

            <TaskModal
                new
                opened={createTaskModal}
                onCreate={(form) => handleCreateTask(form)}
                onClose={() => openCreateTaskModal(false)}
            />
        </Box>}
    </Box >
}
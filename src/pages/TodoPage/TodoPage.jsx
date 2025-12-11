import { Box, Button, ButtonGroup, Checkbox, Typography } from "@mui/material";
import Header from "../../components/Header/Header";
import "./styles.scss";
import React, { useMemo, useState, useContext, useEffect } from "react";
import TodoSubList from "../../components/TodoSubList/TodoSubList";
import { createTask, fetchTasks, removeTask, updateTask, updateTaskStatus } from "../../api/tasks";
import TaskModal from "../../components/TaskModal/TaskModal";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

function useSortedTasks(tasks, sortingType) {
  return useMemo(() => {
    if (!tasks) return null;

    const waiting = [...(tasks.waiting || [])];
    const in_progress = [...(tasks.in_progress || [])];
    const completed = [...(tasks.completed || [])];

    const sortFn = (a, b) => {
      const timeA = new Date(a.endDate).getTime();
      const timeB = new Date(b.endDate).getTime();
      if (sortingType === "i") {
        return b.importance - a.importance;
      } else {
        return timeA - timeB;
      }
    };

    waiting.sort(sortFn);
    in_progress.sort(sortFn);
    completed.sort(sortFn);

    return { waiting, in_progress, completed };
  }, [tasks, sortingType]);
}

export default function TodoPage() {
  const user = useContext(UserContext);

  const [tasks, setTasks] = useState({
    waiting: [],
    in_progress: [],
    completed: [],
  });

  const [draggableTask, setDraggableTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const [createTaskModal, openCreateTaskModal] = useState(false);
  const [editTaskModal, openEditTaskModal] = useState(false);

  const [sorting, setSorting] = useSearchParams();
  const sortType = useMemo(() => sorting.get("s") || "t", [sorting]);

  const sortedTasks = useSortedTasks(tasks, sortType);

  useEffect(() => {
    const projectId = user.value?.project?.id;
    if (!projectId) return;

    const loadTasks = async () => {
      try {
        const response = await fetchTasks(projectId);
        const data = response.data || response;

        const safeData = {
          waiting: Array.isArray(data.waiting) ? data.waiting : [],
          in_progress: Array.isArray(data.in_progress) ? data.in_progress : [],
          completed: Array.isArray(data.completed) ? data.completed : [],
        };

        setTasks(safeData);
      } catch (err) {
        console.error("Failed to fetch tasks", err);
        setTasks({ waiting: [], in_progress: [], completed: [] });
      }
    };

    loadTasks();

    const intervalId = setInterval(() => {
      loadTasks();
    }, 10000);

    return () => clearInterval(intervalId);
  }, [user.value?.project?.id]);

  async function handleCreateTask(form) {
    const projectId = user.value?.project?.id;
    if (!projectId) {
      console.warn("Project ID not available");
      return;
    }

    const { error, task } = await createTask(form, projectId);
    if (!error && task) {
      const stateKey = task.state || "waiting";

      setTasks((prev) => ({
        ...prev,
        [stateKey]: [...(prev[stateKey] || []), task],
      }));

      openCreateTaskModal(false);
    }
  }

  function handleDropTask(targetState) {
    if (!draggableTask) return;

    const fromState = draggableTask.state;
    const toState = targetState;

    updateTaskStatus(draggableTask.id, toState);

    setTasks((prev) => {
      const fromList = prev[fromState] || [];
      const toList = prev[toState] || [];

      return {
        ...prev,
        [fromState]: fromList.filter((t) => t.id !== draggableTask.id),
        [toState]: [...toList, { ...draggableTask, state: toState }],
      };
    });

    setDraggableTask(null);
  }

  async function handleChangeTask(form) {
    if (!editTask) return;

    const projectId = user.value?.project?.id;
    if (!projectId) return;

    const newData = { ...editTask, ...form };
    const { error } = await updateTask(editTask.id, newData, projectId);

    if (!error) {
      setTasks((prev) => ({
        ...prev,
        [editTask.state]: (prev[editTask.state] || []).map((t) =>
          t.id === editTask.id ? newData : t
        ),
      }));
      setEditTask(newData); 
    }
  }

  async function handleDeleteTask(id) {
    if (!editTask) return;

    const { error } = await removeTask(id);
    if (!error) {
      setTasks((prev) => ({
        ...prev,
        [editTask.state]: (prev[editTask.state] || []).filter(
          (t) => t.id !== id
        ),
      }));
      setEditTask(null);
      openEditTaskModal(false);
    }
  }

  function handleChangeSort(sort, showFull) {
    const s = sort ?? sorting.get("s") ?? "t";
    const e = String(showFull ?? sorting.get("e") === "true");
    setSorting({ s, e });
  }

  const showFull = sorting.get("e") === "true";

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
      <Box className="actions" sx={{ padding: 2, paddingBottom: 0 }}>
        <Button variant="outlined" onClick={() => openCreateTaskModal(true)}>
          Создать задачу
        </Button>
        <div className="full">
          <Checkbox
            id="fullInfo"
            checked={showFull}
            onChange={(e) => handleChangeSort(null, e.target.checked)}
          />
          <label htmlFor="fullInfo">Показывать подробности</label>
        </div>
        <div className="sort">
          <Typography>Сортировать по: </Typography>
          <ButtonGroup
            onClick={(ev) => {
              const name = ev.target.name;
              if (name === "t" || name === "i") handleChangeSort(name, null);
            }}
          >
            <Button
              name="t"
              variant={sortType === "t" ? "contained" : "outlined"}
            >
              Времени окончания
            </Button>
            <Button
              name="i"
              variant={sortType === "i" ? "contained" : "outlined"}
            >
              Приоритету
            </Button>
          </ButtonGroup>
        </div>
      </Box>

      {sortedTasks && (
        <Box className="todo-lists" sx={{ p: 2, display: "flex", gap: 2 }}>
          <TodoSubList
            showProgress
            title="В ожидании"
            name="waiting"
            nowTask={{ draggableTask, setDraggableTask }}
            tasks={sortedTasks.waiting}
            onChange={handleDropTask}
            onTaskClick={(task) => {
              setEditTask(task);
              openEditTaskModal(true);
            }}
            showFull={showFull}
          />
          <TodoSubList
            showProgress
            title="В процессе"
            name="in_progress"
            nowTask={{ draggableTask, setDraggableTask }}
            tasks={sortedTasks.in_progress}
            onChange={handleDropTask}
            onTaskClick={(task) => {
              setEditTask(task);
              openEditTaskModal(true);
            }}
            showFull={showFull}
          />
          <TodoSubList
            title="Закончены"
            name="completed"
            nowTask={{ draggableTask, setDraggableTask }}
            tasks={sortedTasks.completed}
            onChange={handleDropTask}
            onTaskClick={(task) => {
              setEditTask(task);
              openEditTaskModal(true);
            }}
            showFull={showFull}
          />
        </Box>
      )}

      <TaskModal
        opened={editTaskModal}
        task={editTask}
        onChange={handleChangeTask}
        onDelete={() => editTask && handleDeleteTask(editTask.id)}
        onClose={() => {
          openEditTaskModal(false);
          setEditTask(null);
        }}
      />

      <TaskModal
        new
        opened={createTaskModal}
        onCreate={handleCreateTask}
        onClose={() => openCreateTaskModal(false)}
      />
    </Box>
  );
}
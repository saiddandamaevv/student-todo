import { Box, Divider, Paper, Typography } from "@mui/material";
import "./styles.scss";
import React, { useRef, useState } from "react";
import TimeProgress from "../TimeProgress/TimeProgress";
import humanizeDuration from "humanize-duration";
import { red } from "@mui/material/colors";

const shortRUHumanizer = humanizeDuration.humanizer({
    language: "ru",
});

export default function TodoSubList(props) {

    const helpMessageRef = useRef();
    const dragCounter = useRef(0);
    const [startProgress, setStartProgress] = useState(false);

    function handleDragTask(event, task) {
        props.nowTask.setDraggableTask(task);
        event.dataTransfer.dropEffect = "copy";
    }

    function dragEnter(ev) {
        ev.preventDefault();
        if (props.nowTask.draggableTask.state === props.name) {
            return;
        }

        dragCounter.current += 1;
        if (dragCounter.current === 1) {
            helpMessageRef.current.classList.add("visible");
        }
    }

    function dragLeave(ev) {
        ev.preventDefault();
        if (props.nowTask.draggableTask.state === props.name) {
            return;
        }

        dragCounter.current -= 1;
        if (dragCounter.current === 0) {
            helpMessageRef.current.classList.remove("visible");
        }
    }

    function dragDrop(ev) {
        if (props.nowTask.draggableTask.state === props.name) {
            props.nowTask.setDraggableTask(null);
            return;
        }

        dragCounter.current = 0;
        helpMessageRef.current.classList.remove("visible");
        props.onChange(props.name);
    }

    React.useEffect(() => {
        setTimeout(() => {
            setStartProgress(true);
        }, 0);
    }, []);

    return <Box
        className={startProgress ? "todo-list progress-start" : "todo-list"}
        sx={{
            flex: "1 1 auto",
            gap: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            maxHeight: "100%",
            overflow: "hidden"
        }}
        onDragEnter={(ev) => dragEnter(ev)}
        onDragLeave={(ev) => dragLeave(ev)}
        onDrop={(ev) => dragDrop(ev)}
        onDragOver={(ev) => ev.preventDefault()}
    >
        <Box ref={helpMessageRef} className="help">
            <Typography variant="h5" align="center" color="info" sx={{}}>
                Добавить в
            </Typography>
            <Typography variant="h5" align="center" color="info" sx={{ fontWeight: "bold" }}>
                &laquo; {props.title} &raquo;
            </Typography>
        </Box>
        <Box elevation={1} sx={{ p: 2, bgcolor: "divider", borderRadius: 2 }}>
            <Typography variant="button" sx={{ textAlign: "center", fontWeight: "bold", display: "block" }}>
                {props.title} ({props.tasks.length})
            </Typography>
        </Box>
        <Divider sx={{ border: 1, borderColor: "divider", marginBlock: 1 }} />
        <Box
            className="tasks-list" sx={{ gap: 1 }}
        >
            {props.tasks.map((item, index) =>
                <div
                    draggable
                    style={{ pointerEvents: "auto", position: "relative" }}
                    onDragStart={(ev) => handleDragTask(ev, item)}
                    onClick={() => props.onTaskClick(item)}
                >
                    {props.nowTask?.draggableTask?.id === item.id && <Box className="skeleton"></Box>}
                    <Paper className="task" sx={{ borderRadius: 2, overflow: "hidden", minHeight: "fit-content" }} elevation={2}>
                        <Box sx={{ paddingTop: 2, paddingBottom: props.showProgress ? 0 : 2 }} style={{
                            background: `linear-gradient(90deg, transparent 90%, ${["#06402B", "#C76E00", "#950606"][item.importance - 1]} 100%)`,
                        }}>
                            <Typography variant="button" sx={{ fontWeight: "bold", paddingInline: 2, maxWidth: "90%" }}>{item.title}</Typography>
                            <Typography variant="body2" sx={{ paddingInline: 2, maxWidth: "90%", whiteSpace: "pre-line", paddingTop: 1 }}>
                                {item.description}
                            </Typography>
                            {
                                props.showFull && <>
                                    <Typography variant="body2" sx={{ paddingInline: 2, paddingTop: 2, fontFamily: "monospace" }}>
                                        Создана: {shortRUHumanizer(
                                            Date.now() - item.startDate.getTime(),
                                            { units: ["y", "d", "h", "m"], round: true }
                                        )} назад
                                    </Typography>
                                    {props.showProgress && <Typography variant="body2" sx={{
                                        paddingInline: 2,
                                        fontFamily: "monospace",
                                        color: (item.endDate.getTime() - Date.now() < 0) ? red[500] : "inherit"
                                    }}>
                                        {(item.endDate.getTime() - Date.now() < 0) ? "Опоздание" : "Истекает"}: {shortRUHumanizer(
                                            item.endDate.getTime() - Date.now(),
                                            { units: ["y", "d", "h", "m"], round: true }
                                        )}
                                    </Typography>}
                                </>
                            }
                            {props.showProgress && <TimeProgress start={item.startDate.getTime()} end={item.endDate.getTime()} />}
                        </Box>
                    </Paper>
                </div>
            )}
        </Box >
    </Box >
}
import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";

import './styles.scss';
import React, { useMemo } from "react";

export default function TaskModal(props) {
    const [priority, setPriority] = React.useState(props.task?.importance ?? 1);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setPriority(props.task?.importance ?? 1);
    }, [props.task]);

    function handleSave(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const newDate = new Date(formJson.endDate);

        if (formJson.title.trim() === "") {
            setErrors({ title: "Название задачи должно быть не пустым" });
            return;
        }

        if (formJson.description.trim() === "") {
            setErrors({ title: "Описание задачи должно быть не пустым" });
            return;
        }

        if (formJson.endDate.trim() === "") {
            setErrors({ title: "Дата окончания должна быть не пустой" });
            return;
        }

        if (new Date(formJson.endDate).getTime() < Date.now()) {
            setErrors({ title: "Дата окончания не должна быть в прошлом" });
            return;
        }

        setErrors({});

        if (props.new) {
            props.onCreate({
                ...formJson,
                importance: priority,
                endDate: newDate
            });
        } else {
            props.onChange({
                ...formJson,
                importance: priority,
                endDate: newDate
            });
        }

        props.onClose();
    }

    function handleDelete() {
        props.onDelete();
        props.onClose();
    }

    const nowDate = useMemo(() => {
        if (!props.task) return '';
        const d = new Date(props.task?.endDate);
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }, [props.task?.endDate]);

    return <Dialog open={props.opened} onClose={() => props.onClose()} maxWidth="sm" fullWidth >
        <DialogTitle>{props.new ? "Новая задача" : `Задача "${props.task?.title}"`}</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
            <form onSubmit={(ev) => handleSave(ev)}>
                <TextField
                    id="outlined-textarea"
                    name="title"
                    label="Название задачи"
                    placeholder="Название задачи"
                    margin='dense'
                    fullWidth
                    defaultValue={props.task?.title}
                    error={errors.title}
                    helperText={errors.title}
                />
                <TextField
                    id="outlined-textarea"
                    name="description"
                    label="Описание задачи"
                    placeholder="Опишите задачу"
                    margin='dense'
                    multiline
                    fullWidth
                    defaultValue={props.task?.description}
                    maxRows={10}
                    error={errors.description}
                    helperText={errors.description}
                />
                <TextField
                    id="outlined-textarea"
                    name="endDate"
                    label="Срок выполнения"
                    placeholder="Опишите задачу"
                    fullWidth
                    margin='dense'
                    defaultValue={nowDate}
                    type="datetime-local"
                    slotProps={{ inputLabel: { shrink: true } }}
                    error={errors.endDate}
                    helperText={errors.endDate}
                />
                <Typography variant="caption" gutterBottom sx={{ display: 'block', color: "rgba(255, 255, 255, 0.7)", marginTop: "8px" }} margin="normal">
                    Приоритет выполнения:
                </Typography>
                <ButtonGroup
                    className="btn-group"
                    size="medium"
                    aria-label="Large button group"
                    style={{ width: "100%" }}
                    onClick={(ev) => setPriority(parseInt(ev.target.name))}
                >
                    <Button variant={priority === 1 ? "contained" : "outlined"} name="1">Низкий</Button>,
                    <Button variant={priority === 2 ? "contained" : "outlined"} name="2">Средний</Button>,
                    <Button variant={priority === 3 ? "contained" : "outlined"} name="3">Высокий</Button>
                </ButtonGroup>
                <DialogActions>
                    {!props.new && <Button style={{ marginRight: "auto" }} color="error" onClick={() => handleDelete()}>
                        Удалить
                    </Button>}
                    <Button onClick={() => props.onClose()}>Закрыть</Button>
                    <Button type="submit">{props.new ? "Создать" : "Сохранить"}</Button>
                </DialogActions>
            </form>
        </DialogContent>
    </Dialog>
}
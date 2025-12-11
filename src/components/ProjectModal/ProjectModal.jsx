import { Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Typography } from "@mui/material";

import './styles.scss';
import React, { useMemo } from "react";

export default function ProjectModal(props) {
    const [priority, setPriority] = React.useState(props.project?.importance ?? 1);
    const [errors, setErrors] = React.useState({});

    React.useEffect(() => {
        setPriority(props.project?.importance ?? 1);
    }, [props.project]);

    function handleSave(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());
        const newDate = new Date(formJson.endDate);

        if (formJson.title.trim() === "") {
            setErrors({ title: "Название проекта должно быть не пустым" });
            return;
        }

        // if (formJson.description.trim() === "") {
        //     setErrors({ title: "Описание задачи должно быть не пустым" });
        //     return;
        // }

        setErrors({});

        if (props.new) {
            props.onCreate({
                ...formJson
            });
        } else {
            props.onChange({
                ...formJson
            });
        }

        props.onClose();
    }

    function handleDelete() {
        props.onDelete();
        props.onClose();
    }

    // const nowDate = useMemo(() => {
    //     if (!props.project) return '';
    //     const d = new Date(props.project?.endDate);
    //     d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    //     return d.toISOString().slice(0, 16);
    // }, [props.project?.endDate]);

    return <Dialog open={props.opened} onClose={() => props.onClose()} maxWidth="sm" fullWidth >
        <DialogTitle>{props.new ? "Новая задача" : `Задача "${props.project?.title}"`}</DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
            <form onSubmit={(ev) => handleSave(ev)}>
                <TextField
                    id="outlined-textarea"
                    name="title"
                    label="Название задачи"
                    placeholder="Название задачи"
                    margin='dense'
                    fullWidth
                    defaultValue={props.project?.title}
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
                    defaultValue={props.project?.description}
                    maxRows={10}
                    error={errors.description}
                    helperText={errors.description}
                />            
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
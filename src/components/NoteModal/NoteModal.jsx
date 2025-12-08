import { Button, Dialog, DialogActions, DialogContent, TextField } from "@mui/material";

export default function NoteModal(props) {

    function handleSave(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const formJson = Object.fromEntries(formData.entries());


        if (props.new) {
            props.onCreate({
                ...formJson,
            });
        } else {
            props.onChange({
                ...formJson,
            });
        }

        props.onClose();
    }

    function handleDelete() {
        props.onDelete();
        props.onClose();
    }

    return (
        <Dialog open={props.opened} onClose={() => props.onClose()} maxWidth="lg" fullWidth >
            <form onSubmit={(ev) => handleSave(ev)}>
                <DialogContent sx={{ paddingBottom: 0, height: "70vh" }}>
                    <TextField
                        id="outlined-textarea"
                        variant="standard"
                        name="title"
                        label="Название"
                        margin='dense'
                        multiline
                        fullWidth
                        defaultValue={props.note?.title}
                        maxRows={10}
                    />
                    <TextField
                        id="outlined-textarea"
                        name="text"
                        label="Заметка"
                        fullWidth
                        multiline
                        rows={20}
                        variant="standard"
                        margin='normal'
                        defaultValue={props.note?.text}
                        slotProps={{ inputLabel: { shrink: true } }}
                        sx={{
                            '& .MuiInput-underline:before': {
                                borderBottom: 'none'
                            },
                            '& .MuiInput-underline:after': {
                                borderBottom: 'none'
                            },
                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                borderBottom: 'none'
                            }
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    {!props.new && <Button style={{ marginRight: "auto" }} color="error" onClick={() => handleDelete()}>
                        Удалить
                    </Button>}
                    <Button onClick={() => props.onClose()}>Закрыть</Button>
                    <Button type="submit">Сохранить</Button>
                </DialogActions>
            </form>
        </Dialog >
    )
}
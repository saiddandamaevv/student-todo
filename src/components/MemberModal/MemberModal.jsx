import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Box,
} from "@mui/material";
import { useState } from "react";

export default function MemberModal({ opened, onClose, onAdd }) {

    const [name, setName] = useState("");

    const handleSubmit = () => {
        const trimmed = name.trim();
        if (trimmed) {
            onAdd({ name: trimmed });
            setName("");
            onClose();
        }
    };

    return (
        <Dialog
            open={opened}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Добавить участника</DialogTitle>
            <DialogContent>
                <Box sx={{ pt: 1 }}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Логин участника"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Введите логин"
                        inputProps={{ maxLength: 100 }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={!name.trim()}
                >
                    Добавить
                </Button>
            </DialogActions>
        </Dialog>
    );
}








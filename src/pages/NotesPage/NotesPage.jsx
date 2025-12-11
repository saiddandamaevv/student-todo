import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import "./styles.scss";
import React, { useEffect, useContext } from "react";
import Note from "../../components/Note/Note";
import { fetchNotes, createNote, updateNote, removeNote } from "../../api/notes";
import NoteModal from "../../components/NoteModal/NoteModal";
import FloatingActionButton from "../../components/FloatingButton/FloatingButton"
import { UserContext } from "../../context/UserContext";



export default function NotesPage() {
    const user = useContext(UserContext);
    const [notes, setNotes] = React.useState([]);
    const [editNote, setEditNote] = React.useState(null);

    const [createNoteModal, openCreateNoteModal] = React.useState(false);
    const [editNoteModal, openEditNoteModal] = React.useState(false);

    useEffect(() => {
        fetchNotes(user.value?.project.id).then((response) => {
            if (!response.error) {
                setNotes(response.data);
            }
        });
    }, [])

    useEffect(() => {
        fetchNotes(user.value?.project.id).then((response) => {
            if (!response.error) {
                setNotes(response.data);
            }
        });
    }, [user.value?.project.id])

    async function handleCreateNote(form) {
        const { error, note } = await createNote(form, user.value.project.id);
        if (!error) {
            setNotes(prev => [...prev, note]);
        }
    }

    async function handleChangeNote(form) {
        const newData = { ...editNote, ...form };
        // console.log(editNote.id);
        // console.log(user.value.project.id)
        const { error } = await updateNote(editNote.id, newData, user.value.project.id);
        if (!error) {
            setNotes(prev => prev.map(note =>
                note.id === editNote.id ? newData : note
            ));
        }
    }

    async function handleDeleteNote(id) {
        const { error } = await removeNote(id);
        if (!error) {
            setNotes(prev => prev.filter(note => note.id !== id));
        }
    }

    function convertData(date) {
        const now = new Date();
        const inputDate = new Date(date);

        const diffMs = now - inputDate;
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours >= 0 && diffHours < 24) {
            return inputDate.toLocaleTimeString('ru-RU', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
            });
        }

        return inputDate.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    return (<Box>
        <Header />

        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
            width: "100%"
        }}>
            {notes?.map((item, index) =>
                <Note
                    key={item.id}
                    title={item.title}
                    text={item.text}
                    createdAt={convertData(item.createdAt)}
                    onNoteClick={() => {
                        setEditNote(item);
                        openEditNoteModal(true);
                    }}
                />
            )}
        </Box>

        <FloatingActionButton onClick={() => openCreateNoteModal(true)} />

        <NoteModal
            opened={editNoteModal}
            note={editNote}
            onChange={(form) => handleChangeNote(form)}
            onDelete={() => handleDeleteNote(editNote.id)}
            onClose={() => openEditNoteModal(false)}
        />

        <NoteModal
            new
            opened={createNoteModal}
            onCreate={(form) => handleCreateNote(form)}
            onClose={() => openCreateNoteModal(false)}
        />

    </Box>)
}
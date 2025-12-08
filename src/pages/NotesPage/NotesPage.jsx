import { Box } from "@mui/material";
import Header from "../../components/Header/Header";
import "./styles.scss";
import React, { useEffect } from "react";
import Note from "../../components/Note/Note";
import { fetchNotes, createNote, updateNote, removeNote } from "../../api/notes";
import NoteModal from "../../components/NoteModal/NoteModal";
import FloatingActionButton from "../../components/FloatingButton/FloatingButton"


export default function NotesPage() {
    const [notes, setNotes] = React.useState([]);
    const [editNote, setEditNote] = React.useState(null);

    const [createNoteModal, openCreateNoteModal] = React.useState(false);
    const [editNoteModal, openEditNoteModal] = React.useState(false);

    useEffect(() => {
        fetchNotes().then((response) => {
            if (!response.error) {
                setNotes(response.data);
            }
        });
    }, [])

    async function handleCreateNote(form) {
        const { error, note } = await createNote(form);
        if (!error) {
            setNotes(prev => [...prev, note]);
        }
    }

    async function handleChangeNote(form) {
        const newData = { ...editNote, ...form };
        console.log(editNote.id);
        const { error } = await updateNote(editNote.id, newData);
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



    return (<Box>
        <Header />

        <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(600px, 1fr))",
            width: "100%"
        }}>
            {notes?.map((item, index) =>
                <Note
                    key = {item.id}
                    title = {item.title}
                    text = {item.text}
                    onNoteClick = {() => {
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
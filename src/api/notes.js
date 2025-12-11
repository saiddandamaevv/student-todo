import { nanoid } from "nanoid";
import server from "./server";

function convertNote(data) {
    return {
        id: data.id,
        title: data.name,
        text: data.description,
        createdAt: data.created_at
    };
}

export async function fetchNotes(projectId) {
    try{
        const response = await server.get(`/projects/${projectId}/notes`);
        const list = response.data ?? [];
        const result = [];

        for (const element of list) {
            const object = convertNote(element);
            result.push(object);
        }
        return {
            data: result,
            error: false,
        };
    } catch (err) {
        return { error: true };
    }
}


export async function createNote(data, projectId){
    try{
        console.log('Данные для создания заметки', data, projectId)
        const response = await server.post(`/notes/create`, {
            name: data.title,
            description: data.text,
            project_id: projectId
        });
        const result = {
            id: response.data.id,
            name: data.title,
            description: data.text
        }
        return {error: false, note: convertNote(result)};
    }
    catch (err) {
        console.error('Error details:', err.response?.data); 
        return { error: true, message: err.response?.data?.message };
    }
}

export async function updateNote(id, data, projectId) {
    try {
        await server.put(`/notes/${id}/edit`, {
            name: data.title,
            description: data.text,
            project_id: projectId
        });
        return { error: false };
    } catch (err) {
        console.error('Error details:', err.response?.data);
        return { error: true, message: err.response?.data?.message };
    }
}

export async function removeNote(id) {
    try {
        await server.delete(`/notes/${id}`, {});
        return { error: false };
    } catch (err) {
        return { error: true };
    }
}

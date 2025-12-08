import { nanoid } from "nanoid";
import server from "./server";

function convertTask(data) {
    return {
        id: data.id,
        state: data.status,
        title: data.title,
        description: data.description,
        startDate: new Date(data.created_at),
        endDate: new Date(data.deadline),
        importance: data.importance
    };
}

export async function createTask(data) {
    try {
        const response = await server.post(`/todo/create`, {
            title: data.title,
            description: data.description,
            deadline: data.endDate.toISOString(),
            importance: data.importance,
        });
        return { error: false, task: convertTask(response.data) };
    } catch (err) {
        return { error: true };
    }
}


export async function fetchTasks() {
    try {
        const response = await server.get("/todo/all");
        const list = response.data ?? [];
        const result = {
            waiting: [],
            in_progress: [],
            completed: [],
        };

        for (const element of list) {
            const object = convertTask(element);
            result[element.status].push(object);
        }

        return {
            data: result,
            error: false,
        };
    } catch (err) {
        return { error: true };
    }
}

export async function updateTask(id, data) {
    try {
        await server.put(`/todo/${id}/edit`, {
            title: data.title,
            description: data.description,
            deadline: data.endDate.toISOString(),
            createdAt: data.startDate.toISOString(),
            importance: data.importance,
        });
        return { error: false };
    } catch (err) {
        return { error: true };
    }
}

export async function updateTaskStatus(id, newStatus) {
    try {
        await server.patch(`/todo/${id}/edit?status=${newStatus}`);
        return { error: false };
    } catch (err) {
        return { error: true };
    }
}

export async function removeTask(id) {
    try {
        await server.delete(`/todo/${id}/`, {});
        return { error: false };
    } catch (err) {
        return { error: true };
    }
}
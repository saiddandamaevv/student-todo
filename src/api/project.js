import { nanoid } from "nanoid";
import server from "./server";

export async function fetchProjects() {
    try{
        const response = await server.get(`/projects`);
        const result = response.data ?? [];

        return {
            data: result,
            error: false,
        };
    } catch (err) {
        return { error: true };
    }
}

export async function fetchMembers(projectId) {
    try{
        const response = await server.get(`/projects/${projectId}/members`);
        const result = response.data ?? [];

        return {
            data: result,
            error: false,
        };
    } catch (err) {
        return { error: true };
    }
}

export async function createProject(data){
    try{
        console.log(data)
        const response = await server.post(`/projects`, {
            name: data.title,
            description: data.description
        });
        const result = {
            id: response.data.id,
            name: response.data.name,
            description: response.data.description
        }
        // return {error: false, note: convertNote(result)};
        return {error: false, project: result};
    }
    catch (err) {
        console.error('Error details:', err.response?.data); 
        return { error: true, message: err.response?.data?.message };
    }
}

export async function getProject(projectId) {
    try{
        const response = await server.get(`/projects/${projectId}`);
        const result = response.data ?? [];

        return {
            data: result,
            error: false,
        };
    } catch (err) {
        console.log(err)
        return { error: true };
    }
}

export async function addUser(projectId, id) {
    try{
        const response = await server.post(`/projects/${projectId}/members`, {
            user_id: id
        });
        const result = response.data ?? [];

        return {
            data: result,
            error: false,
        };
    } catch (err) {
        console.log(err)
        return { error: true };
    }
}
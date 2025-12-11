import { nanoid } from "nanoid";
import server from "./server";

export async function getUserByLogin(userId) {
    try{
        console.log(123)
        const response = await server.get(`/users/by-login?login=${userId}`);
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
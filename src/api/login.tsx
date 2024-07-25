import { callApi } from "./base-call-api";


export default async function login(username: string, password: string) {
    const body = {
        UserNameOrEmail : username,
        Password : password,
    };

    return await callApi('POST', '/api/user/login', body);
};
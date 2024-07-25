import { callApi } from "./base-call-api";


export default async function check() {

    return await callApi('GET', '/api/user/check-connection-ready');
};
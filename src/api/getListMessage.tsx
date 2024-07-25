import { callApi } from "./base-call-api";

export default async function checkApiValid() {

    return await callApi('GET', '/api/chat/get-list-chat-history');

};
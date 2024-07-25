import { callApi } from "./base-call-api";

export default async function sendMessage(message: string, model: string) {

    return await callApi('POST', '/api/chat/send-message',  { Message: message , Model: model });

};
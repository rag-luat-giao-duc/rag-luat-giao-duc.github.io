import { callApi } from "./base-call-api";

export default async function checkListModel() {

    return await callApi('GET', '/api/model/get-list-models');

};
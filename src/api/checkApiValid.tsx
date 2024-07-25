import { callApi } from "./base-call-api";
import Cookies from "js-cookie";

export default async function checkApiValid() {

    const apiKey = Cookies.get('apiKey');

    return apiKey ? await callApi('GET', '/api/user/check-api-key?id=' + apiKey) : null;

};
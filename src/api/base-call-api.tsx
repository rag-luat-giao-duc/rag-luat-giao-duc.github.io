import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from 'js-cookie';

const api = axios.create({
    baseURL: 'https://api-rag-luat-giao-duc.azurewebsites.net/',
});

export const callApi = async (
    method: string,
    subquery: string,
    body: object = {}
): Promise<AxiosResponse> => {
    try {
        const storedApiKey = Cookies.get('apiKey');

        const config: AxiosRequestConfig = {
            method: method as any,
            url: subquery,
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'api-key': storedApiKey || '',
            }
        };

        const response = await api.request(config);
        return response;
    } catch (error) {
        // eslint-disable-next-line no-throw-literal
        throw error as AxiosError;
    }
};

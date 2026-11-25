import { API_URL } from '../config';
import { getAuthHeaders } from '../utils/helpers';

export class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}

// App.js registers this so an expired session signs the admin out from anywhere
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => { onUnauthorized = handler; };

/**
 * Calls the API with the admin's token. Sends JSON (or FormData for uploads),
 * parses the JSON reply and throws ApiError with the server's message on failure.
 */
export const api = async (endpoint, { method = 'GET', body, auth = true } = {}) => {
    const isForm = typeof FormData !== 'undefined' && body instanceof FormData;
    const headers = {
        ...(auth ? getAuthHeaders() : {}),
        ...(body !== undefined && !isForm ? { 'Content-Type': 'application/json' } : {}),
    };

    let response;
    try {
        response = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers,
            ...(body !== undefined ? { body: isForm ? body : JSON.stringify(body) } : {}),
        });
    } catch {
        throw new ApiError('Could not reach the server. Check your connection and try again.', 0);
    }

    const data = response.status === 204 ? null : await response.json().catch(() => null);
    if (!response.ok) {
        if (response.status === 401 && auth) {
            onUnauthorized();
            throw new ApiError('Your session has expired. Please sign in again.', 401);
        }
        const fallback = response.status === 403
            ? 'Your role does not have permission to do this.'
            : `Request failed (${response.status}).`;
        throw new ApiError((data && data.message) || fallback, response.status);
    }
    return data;
};

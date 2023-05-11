import { apiPost, apiGet, apiPatch } from '../../utils/api';
import { API_URL } from '../constant';

export const createSessionApi = data => apiPost(`${API_URL}session/`, data);

export const updateSessionApi = (id, data) => apiPatch(`${API_URL}session/${id}`, data);

export const getSessionApi = () => apiGet(`${API_URL}session/`);

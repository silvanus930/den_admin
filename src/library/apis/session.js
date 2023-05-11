import { apiPost, apiPatch } from '../../utils/api';
import { API_URL } from '../constant';

export const createSessionApi = data => apiPost(`${API_URL}session/`, data);

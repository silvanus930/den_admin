import { apiDelete, apiGet, apiPatch, apiPost } from '../../utils/api';
import { API_URL } from '../constant';
const headers = {
    'Authorization':'Bearer keysngnjGgAAjDzwM'
}
export const createUserApi = data => apiPost(`${API_URL}user`, data);

export const listUserApi = (type, options) => apiGet(`${API_URL}user/all/${type}`, options);

export const editUserApi = profileId => apiGet(`${API_URL}user/${profileId}`);

export const updateUsersApi = (profileId, data) => apiPatch(`${API_URL}user/${profileId}`, data);

export const createMemberApi = (member) => apiPost(`${API_URL}member`, member);

export const listMemberApi = (profileId) => apiGet(`${API_URL}member/${profileId}`);

export const updateMemberApi = (profileId, data) => apiPatch(`${API_URL}member/${profileId}`, data);

export const listMemberUserApi = (profileId) => apiGet(`${API_URL}member/all/${profileId}`);

export const searchUserApi = (type, options) => apiGet(`${API_URL}user/all/${type}`, options);

export const paginationApi = (type, filter, skip, limit) => apiGet(`${API_URL}user/all/${type}`, { filter, skip, limit });

export const membersPaginationApi = (options) => apiGet(`${API_URL}member`, options);

export const searchMemberApi = (searchText,filter="Active") => apiGet(`${API_URL}member?search=${searchText}&filter=${filter}`);

export const createMemberFavUrlApi = data => apiPost(`${API_URL}favourite`, data);

export const getMemberFavUrls = memberId => apiGet(`${API_URL}favourite/${memberId}`);

export const updateMemberFavUrlApi = (favouriteId, data) => apiPatch(`${API_URL}favourite/${favouriteId}`, data);

export const uploadFileAPI = data => apiPost(`${API_URL}upload`, data);

export const downloadFileAPI = data => apiPost(`${API_URL}download`, data);

export const getPublicFile = fileName => apiGet(`${API_URL}static/${fileName}`);

export const patchFirstLogin = (id) => apiPatch(`${API_URL}user/firstLogin/${id}`);

export const getComments = (id) => apiGet(`${API_URL}comment/${id}`);

export const postComment =(data) => apiPost(`${API_URL}comment`, data);

export const getSocialAssessmentQuestion = (ques) => apiGet(`${API_URL}socialAssessmentQuestion/${ques}`);

export const getAuthor = () => apiGet(`${API_URL}author`);

export const postAuthor =(data) => apiPost(`${API_URL}author`, data);

export const patchAuthor = (id,data) => apiPatch(`${API_URL}author/${id}`,data);

export const deleteAuthor = (id) => apiDelete(`${API_URL}author/${id}`);

export const searchAuthorApi = (options) => apiGet(`${API_URL}author`,options);

export const authorDetailsApi  =(id) => apiGet(`${API_URL}author/${id}`)

export const getCourse = () => apiGet(`${API_URL}course`);

export const postCourse =(data) => apiPost(`${API_URL}course`, data);

export const patchCourse = (id,data) => apiPatch(`${API_URL}course/${id}`,data);

export const deleteCourse = (id) => apiDelete(`${API_URL}course/${id}`);

export const searchCourseApi = (options) => apiGet(`${API_URL}course`,options);

export const courseDetailsApi  =(id) => apiGet(`${API_URL}course/details/${id}`)

export const getVideo = () => apiGet(`${API_URL}video`);

export const postVideo =(data) => apiPost(`${API_URL}video`, data);

export const patchVideo = (id,data) => apiPatch(`${API_URL}video/${id}`,data);

export const searchVideoApi = (options) => apiGet(`${API_URL}video`,options);

export const videoDetails = (id) => apiGet(`${API_URL}video/details/${id}`);

export const deleteVideo = (id) => apiDelete(`${API_URL}video/${id}`);

export const getWorkShop = () => apiGet(`${API_URL}workshop`);

export const patchWorkShop = (id,data) => apiPatch(`${API_URL}workshop/${id}`,data);

export const searchWorkShopApi = (options) => apiGet(`${API_URL}workshop`,options);

export const workShopDetailsApi  =(id) => apiGet(`${API_URL}workshop/details/${id}`)

export const getCalSyncState  = (id) => apiGet(`${API_URL}calSyncState/?id=${id}`)

export const getTags = () => apiGet(`${API_URL}tags`);

export const controlCalendar = (id, value) => apiGet(`${API_URL}controlCalWatch/?id=${id}&value=${value}`);


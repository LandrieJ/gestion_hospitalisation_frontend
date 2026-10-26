import { da } from 'date-fns/locale';
import api from '../api/Api';


const handleError = (error, message) => {
    throw new Error(error.response?.data?.detail || message);
};

// GET all
export const apiTogetAll = async (url, params = {}) => {
    try {
        const response = await api.get(url, { params });
        return response.data;
    } catch (error) {
        handleError(error, `Erreur lors de la récupération de ${url}`);
    }
};



// GET by ID
export const apiTogetById = async (url, id) => {
    try {
        const response = await api.get(`${url}${id}/`);
        return response.data;
    } catch (error) {
        handleError(error, `Erreur lors de la récupération de ${url}${id}`);
    }
};



// POST
export const apiToPost = async (url, data, isFormData = false) => {
    try {
        const config = {};

        if (isFormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        }

        const response = await api.post(url, data, config);
        return response.data;

    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Détails backend:", error.response?.data);
        console.groupEnd();
        handleError(error, `Erreur lors de la création de ${url}`);
        throw error;
    }
};
export const addUserResource = async (resourceType, userId, newData) => {
    const formData = new FormData();

    Object.keys(newData).forEach((key) => {
        if (newData[key] !== undefined && newData[key] !== null) {
            formData.append(key, newData[key]);
        }
    });

    const url = `comptes/users/${userId}/${resourceType}/`;
    return await apiToPost(url, formData, true);
};




// PATCH
export const apiToPatch = async (url, id = '', data, isFormData = false, fullUrl = false) => {
    try {
        const config = {};
        if (isFormData) {
            config.headers = { 'Content-Type': 'multipart/form-data' };
        } else {
            config.headers = { 'Content-Type': 'application/json' };
        }

        const endpoint = fullUrl ? url : `${url}${id ? id + '/' : ''}`;

        const response = await api.patch(endpoint, data, config);
        return response.data;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Détails backend:", error.response?.data);
        console.groupEnd();
        handleError(error, `Erreur lors de la mise à jour de ${url}${id}`);
        throw error;
    }
};

export const updateUser = async (id, userData, photoFile) => {
    const { groups, user_permissions, last_login, ...updatedUserData } = userData;
    const formData = new FormData();

    Object.keys(updatedUserData).forEach((key) => {
        if (updatedUserData[key] !== undefined && updatedUserData[key] !== null) {
            formData.append(key, updatedUserData[key]);
        }
    });

    if (photoFile) {
        formData.append("profile_picture", photoFile);
    }

    return await apiToPatch("comptes/users/", id, formData, true);
};
export const updateUserResource = async (resourceType, userId, resourceId, updatedData) => {
    const { id, ...filteredData } = updatedData;
    const formData = new FormData();

    Object.keys(filteredData).forEach((key) => {
        if (filteredData[key] !== undefined && filteredData[key] !== null) {
            formData.append(key, filteredData[key]);
        }
    });

    const url = `comptes/users/${userId}/${resourceType}/`;

    return await apiToPatch(url, resourceId, formData, true);
};
export const updateUserHoraires = async (userId, updatedData) => {
    const url = `comptes/users/${userId}/horaires/`;
    return await apiToPatch(url, '', updatedData, false, true);
};



// DELETE
export const apiToDelete = async (url, id) => {
    try {
        await api.delete(`${url}${id}/`);
    } catch (error) {
        handleError(error, `Erreur lors de la suppression de ${url}${id}`);
    }
};
export const deleteUserResource = async (resourceType, userId, resourceId) => {
    const url = `comptes/users/${userId}/${resourceType}/`;
    return await apiToDelete(url, resourceId);
};

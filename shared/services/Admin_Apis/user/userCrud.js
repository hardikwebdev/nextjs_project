import axios from "axios";
import { RESET_PASSWORD_URL } from "../auth/authCrud";


const apiUrl = process.env.API_KEY;
export const GET_USER_URL = `${apiUrl}/users`;
export const CREATE_USER_URL = `${apiUrl}/users/create`;
export const UPDATE_USER_URL = `${apiUrl}/users/update`;
export const DELETE_USER_URL = `${apiUrl}/users/delete`;
export const RESEND_INVITATION_URL = `${apiUrl}/users/resendInvitation`;
export const RESENT_USER_PASSWORD_URL = `${apiUrl}/users/resetPassword`;



export const createUser = async (accessToken, email, first_name, last_name, bio, profile_url) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(CREATE_USER_URL, { email, first_name, last_name, bio, profile_url }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const updateUser = async (accessToken, email, first_name, last_name, bio, profile_url, status) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_USER_URL, { email, first_name, last_name, bio, profile_url, status }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const getUsers = async (accessToken, page, pageSize, sortBy, sortOrder, status, search) => {
    const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        status,
        search,
    };
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_USER_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const deleteUser = async (id, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(DELETE_USER_URL, { id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const resendInvitation = async (id, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(RESEND_INVITATION_URL, { id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const resetUserPassword = async (email, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(RESENT_USER_PASSWORD_URL, { email }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
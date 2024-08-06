import axios from "axios";


const apiUrl = process.env.API_KEY;
export const GET_PROFILE_DATA_URL = `${apiUrl}/profile`;
export const UPDATE_PROFILE_DATA_URL = `${apiUrl}/profile/update`;

export const getProfileData = async (accessToken) => {

    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_PROFILE_DATA_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const updateProfile = async (accessToken, id, profile_url, first_name, last_name, email,  bio, password, current_password) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_PROFILE_DATA_URL, { id, profile_url, first_name, last_name, email, bio, password, current_password }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}
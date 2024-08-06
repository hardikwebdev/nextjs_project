import axios from "axios";


const apiUrl = process.env.API_KEY;
export const GET_SLIDER_URL = `${apiUrl}/configuration/slider`;
export const CREATE_SLIDER_URL = `${apiUrl}/configuration/slider/create`;
export const UPDATE_SLIDER_URL = `${apiUrl}/configuration/slider/update`;
export const DELETE_SLIDER_URL = `${apiUrl}/configuration/slider/delete`;

export const createSlider = async (accessToken, header_text, sub_text, media, text_button_alignment, slider_type, status, buttons) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(CREATE_SLIDER_URL, { header_text, sub_text, media, text_button_alignment, slider_type, status, buttons }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const updateSlider = async (accessToken, id, header_text, sub_text, media, text_button_alignment, slider_type, status, buttons, deleted_media) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_SLIDER_URL, { id, header_text, sub_text, media, text_button_alignment, slider_type, status, buttons, deleted_media }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const getSliders = async (accessToken, slider_type, page, pageSize, sortBy, sortOrder, status) => {
    const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        status,
        slider_type,
    };
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_SLIDER_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const deleteSlider = async (id, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(DELETE_SLIDER_URL, { id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
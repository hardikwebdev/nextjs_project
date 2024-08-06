import axios from "axios";

const apiUrl = process.env.API_KEY;
export const GET_HOME_BLOCK_URL = `${apiUrl}/configuration/homeblock`;
export const UPDATE_HOME_BLOCK_URL = `${apiUrl}/configuration/homeblock/update`;



export const updateHomeBlock = async (accessToken, id, header_text, sub_text, media, buttons, text_button_alignment, status, block_type) => {
    
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_HOME_BLOCK_URL, { id, header_text, sub_text, media, buttons, text_button_alignment, status, block_type }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const getHomeBlock = async (accessToken, block_type) => {
    const params = {
        block_type
    };
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_HOME_BLOCK_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
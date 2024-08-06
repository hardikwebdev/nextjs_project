import axios from "axios";

const apiUrl = process.env.API_KEY;
export const GET_DASHBOAD_DATA_URL = `${apiUrl}/dashboard`;

export const getDashboardData = async (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_DASHBOAD_DATA_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

import axios from "axios";


const frontUrl = process.env.NEXT_PUBLIC_API_KEY_2;

export const GET_HOMEPAGE_URL = `${frontUrl}/homepage`;
export const GET_GENERALCONFIG_URL = `${frontUrl}/homepage/generalconfiguration`;
export const SEND_CHAT = `${frontUrl}/homepage/sendChat`;
export const SEND_CHAT_WITH_LOGIN = `${frontUrl}/user_profile/sendChat`;
export const SET_BOOKMARK = `${frontUrl}/homepage/bookmark`;
export const GET_BLOGS_BOOKMARKS = `${frontUrl}/blogs/getSavedBlogs`;

export const getHomePage = async () => {
    return await axios
        .get(GET_HOMEPAGE_URL)
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getGeneralConfig = async () => {
    return await axios
        .get(GET_GENERALCONFIG_URL)
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}


export const sendChat = async (name, email, message, reCaptchaToken) => {

    return await axios
        .post(SEND_CHAT, { name, email, message, reCaptchaToken })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}

export const sendChatWithLogin = async (accessToken, name, email, message) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return await axios
        .post(SEND_CHAT_WITH_LOGIN, { name, email, message }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}

export const setBookmarkData = async (accessToken, user_id, blog_id, bookmarked) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return await axios
        .post(SET_BOOKMARK, { user_id, blog_id, bookmarked }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}

export const getBlogsBookmarksData = async (accessToken, page, pageSize, sortBy, sortOrder, withPagination) => {
    const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        withPagination
    };
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_BLOGS_BOOKMARKS, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
import axios from "axios";


const frontUrl = process.env.NEXT_PUBLIC_API_KEY_2;

export const GET_PROFILE_URL = `${frontUrl}/user_profile`;
export const UPDATE_PROFILE_URL = `${frontUrl}/user_profile/update`;
export const GET_BLOG_URL = `${frontUrl}/blogs/getSavedBlogs`;
export const GET_NEWS_URL = `${frontUrl}/news/getSavedNews`;
export const SET_SAVED_BLOG_URL = `${frontUrl}/homepage/bookmark`;
export const GET_SAVED_ALL_DATA_URL = `${frontUrl}/blogs/getSavedBlogsAndNews`;
export const SET_SYNCED_SAVED_BLOG_URL = `${frontUrl}/homepage/syncBookmark`;


export const getProfile = async (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_PROFILE_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}


export const updateProfile = async (accessToken, first_name, last_name, address, bio, email, profile_url) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return await axios
        .post(UPDATE_PROFILE_URL, { first_name, last_name, address, bio, email, profile_url }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}

export const getBlogData = async (accessToken, page, pageSize, sortBy, sortOrder, withPagination) => {
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
        .get(GET_BLOG_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getNewsData = async (accessToken, page, pageSize, sortBy, sortOrder, withPagination) => {
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
        .get(GET_NEWS_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getAllSavedData = async (accessToken, page, pageSize, sortBy, sortOrder, withPagination) => {
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
        .get(GET_SAVED_ALL_DATA_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}


export const setSavedBlogsData = async (accessToken, user_id, blog_id, bookmarked) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(SET_SAVED_BLOG_URL, { user_id, blog_id, bookmarked }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}


export const setSyncAllSavedBlogsData = async (accessToken, bookmarkData) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(SET_SYNCED_SAVED_BLOG_URL,{bookmarkData}, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

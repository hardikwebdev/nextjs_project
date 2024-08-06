import axios from "axios";


const frontUrl = process.env.NEXT_PUBLIC_API_KEY_2;
export const GET_BLOGS_URL = `${frontUrl}/blogs`;
export const GET_TAGS_URL = `${frontUrl}/homepage/getTags`;
export const GET_CATEGORIES_URL = `${frontUrl}/blogs/getAllCategory`;
export const SEND_COMMENT = `${frontUrl}/blogs/addComment`;
export const GET_COMMENTS = `${frontUrl}/homepage/getComments`;
export const SEND_NEWS_COMMENT = `${frontUrl}/news/addComment`;
export const GET_DETAILS = `${frontUrl}/homepage/getBlogOrNewsDeatils`;


export const getAllTags = async () => {
    return await axios
        .get(GET_TAGS_URL)
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

let abort = null;

export const getFrontBlogs = async (page, pageSize, sortBy, sortOrder, post_type, search, tag_ids, category_id, excludeId) => {
    if (abort) {
        abort.abort()
    }
    abort = new AbortController();
    const { signal } = abort;
    const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        post_type,
        search,
        tag_ids,
        category_id,
        excludeId
    };
    return await axios
        .get(GET_BLOGS_URL, { params, signal })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const sendComment = async (accessToken, name, email, comment, blog_id) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return await axios
        .post(SEND_COMMENT, { name, email, comment, blog_id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}

export const sendNewsComment = async (accessToken, name, email, comment, blog_id) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };

    return await axios
        .post(SEND_NEWS_COMMENT, { name, email, comment, blog_id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        })
}


export const getComments = async (page, pageSize, sortBy, sortOrder, status, blog_id) => {
    const params = {
        page, pageSize, sortBy, sortOrder, status, blog_id
    };
    return await axios
        .get(GET_COMMENTS, { params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getCategories = async () => {

    return await axios
        .get(GET_CATEGORIES_URL)
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getDetails = async (id) => {
    const params = {
        id
    };
    return await axios
        .get(GET_DETAILS, { params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

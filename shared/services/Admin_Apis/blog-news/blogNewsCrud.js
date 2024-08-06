import axios from "axios";


const apiUrl = process.env.API_KEY;
export const GET_BLOGS_URL = `${apiUrl}/blogs`;
export const GET_AUTHORS_URL = `${apiUrl}/blogs/getAllAuthor`;
export const GET_ALL_CATEGORIES_URL = `${apiUrl}/category/getAllCategory`;
export const CREATE_BLOG_URL = `${apiUrl}/blogs/create`;
export const UPDATE_BLOG_URL = `${apiUrl}/blogs/update`;
export const DELETE_BLOG_URL = `${apiUrl}/blogs/delete`;

export const createBlog = async (accessToken, title, short_description, category_id, content_type, post_type, tags, banner_media, user_id, status, drafted, publish_date, long_description, parent_id) => {
    console.log(accessToken);
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(CREATE_BLOG_URL, { title, short_description, category_id, content_type, post_type, tags, banner_media, user_id, status, drafted, publish_date, long_description, parent_id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const updateBlog = async (accessToken, id, title, user_id, banner_media, category_id, content_type, long_description, parent_id, post_type, short_description, drafted, status, tags, publish_date, deleted_media) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_BLOG_URL, { id, title, user_id, banner_media, category_id, content_type, long_description, parent_id, post_type, short_description, drafted, status, tags, publish_date, deleted_media }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}

export const getBlogs = async (accessToken, page, pageSize, sortBy, sortOrder, post_type, status, search) => {
    const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        post_type,
        status,
        search,
    };
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_BLOGS_URL, { headers, params })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const getCategories = async (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_ALL_CATEGORIES_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
export const getAuthors = async (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_AUTHORS_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

export const deleteBlog = async (id, accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(DELETE_BLOG_URL, { id }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}
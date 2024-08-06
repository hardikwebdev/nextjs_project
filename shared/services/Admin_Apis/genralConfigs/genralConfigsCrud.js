import axios from "axios";

const apiUrl = process.env.API_KEY;
export const GET_GENERALCONFIG_URL = `${apiUrl}/configuration/generalconfiguration`;
export const UPDATE_GENERALCONFIG_URL = `${apiUrl}/configuration/generalconfiguration/update`;

export const updateGeneralConfigs = async (accessToken, id, tip_toggle, blog_toggle, comments_toggle, news_toggle, site_logo, font_color
    , primary_theme_color, secondary_theme_color, primary_button_color, secondary_button_color, site_name, site_square_logo, site_front_logo, media_config, header_footer_bg_color, header_footer_font_color) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .post(UPDATE_GENERALCONFIG_URL, {
            id, tip_toggle, blog_toggle, comments_toggle, news_toggle, site_logo, font_color
            , primary_theme_color, secondary_theme_color, primary_button_color, secondary_button_color, site_name, site_square_logo, site_front_logo, media_config, header_footer_bg_color, header_footer_font_color
        }, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error
        });
}



export const getGeneralConfigs = async (accessToken) => {
    const headers = {
        'Authorization': `Bearer ${accessToken}`
    };
    return await axios
        .get(GET_GENERALCONFIG_URL, { headers })
        .then((response) => {
            console.log("response success  :", response);
            return response;
        })
        .catch((error) => {
            console.log("error response : ", error);
            throw error;
        });
}

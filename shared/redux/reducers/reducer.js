// import { Datacard } from "../../data/Ecommerce/data"
// const INIT_STATE = {
//     carts: []
// };

const authState = {
    userData: [],
    bookmarkData: [],
    frontEndUserData: [],
    generalConfigs: [],
    blogNewsData: [],
    blogNewsDataPreview: [],
    OtpEmail: [],
    commentType: [],
    sliderType: [],
}

// export const cartreducer = (state = INIT_STATE, action) => {
//     switch (action.type) {
//         case "ADD_CART":

//             const IteamIndex = state.carts.findIndex((iteam) => iteam.id === action.payload.id);

//             if (IteamIndex >= 0) {
//                 state.carts[IteamIndex].qnty += 1
//                 return {
//                     ...state,
//                     carts: [...state.carts]
//                 }
//             } else {
//                 const temp = { ...action.payload, qnty: 1 }
//                 return {
//                     ...state,
//                     carts: [...state.carts, temp]
//                 }
//             }



//         case "RMV_CART":
//             const data = state.carts.filter((el) => el.id !== action.payload);
//             // console.log(data);
//             return {
//                 ...state,
//                 carts: data
//             }

//         case "RMV_ONE":
//             const IteamIndex_dec = state.carts.findIndex((iteam) => iteam.id === action.payload.id);

//             if (state.carts[IteamIndex_dec].qnty >= 1) {
//                 const deleteiteams = state.carts[IteamIndex_dec].qnty -= 1
//                 console.log([...state.carts, deleteiteams]);

//                 return {
//                     ...state,
//                     carts: [...state.carts]
//                 }
//             } else if (state.carts[IteamIndex_dec].qnty === 1) {
//                 const data = state.carts.filter((el) => el.id !== action.payload);

//                 return {
//                     ...state,
//                     carts: data
//                 }
//             }
//             break;
//         default:

//             return state

//     }
// }

export const authReducer = (state = authState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return {
                ...state,
                userData: action.payload, // Update userData with the API response
            };
        case 'SET_FRONTEND_USER_DATA':
            return {
                ...state,
                frontEndUserData: action.payload, // Update userData with the API response
            };
        case 'SET_BLOG_NEWS_DATA':
            return {
                ...state,
                blogNewsData: action.payload, // Update userData with the API response
            };
        case 'SET_BLOG_NEWS_DATA_PREVIEW':
            return {
                ...state,
                blogNewsDataPreview: action.payload, // Update userData with the API response
            };
        case 'SET_COMMENT_TYPE':
            return {
                ...state,
                commentType: action.payload, // Update userData with the API response
            };

        case 'SET_OTP_EMAIL_FOR_LOGIN':
            return {
                ...state,
                OtpEmail: action.payload, // Update userData with the API response
            };

        case 'SET_GENERAL_CONFIGS_DATA':
            return {
                ...state,
                generalConfigs: action.payload, // Update userData with the API response
            };
        case 'SET_BOOKMARK':
            return {
                ...state,
                bookmarkData: action.payload, // Update userData with the API response
            };
        case 'SET_SLIDER_TYPE':
            return {
                ...state,
                sliderType: action.payload, // Update userData with the API response
            };
        case 'RESET_USER_DATA':
            return {
                ...authState, // Reset to the initial state
            };
        default:
            return state;
    }

};
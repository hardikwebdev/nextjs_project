// authActions.js

export const setUserData = (userData) => ({
  type: 'SET_USER_DATA',
  payload: userData,
});
export const setFrontEndUserData = (userData) => ({
  type: 'SET_FRONTEND_USER_DATA',
  payload: userData,
});
export const setGeneralConfigs = (data) => ({
  type: 'SET_GENERAL_CONFIGS_DATA',
  payload: data,
});
export const setBookmark = (Data) => ({
  type: 'SET_BOOKMARK',
  payload: Data,
});
export const resetUserData = () => ({
  type: 'RESET_USER_DATA',
});
export const setBlogAndNewsData = (Data) => ({
  type: 'SET_BLOG_NEWS_DATA',
  payload: Data,
});
export const setCommentType = (Data) => ({
  type: 'SET_COMMENT_TYPE',
  payload: Data,
});
export const setSliderType = (Data) => ({
  type: 'SET_SLIDER_TYPE',
  payload: Data,
});
export const setBlogAndNewsDataForPreview = (Data) => ({
  type: 'SET_BLOG_NEWS_DATA_PREVIEW',
  payload: Data,
});
export const setOtpEmailForLogin = (Data) => ({
  type: 'SET_OTP_EMAIL_FOR_LOGIN',
  payload: Data,
});
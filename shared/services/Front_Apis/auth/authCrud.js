import axios from "axios";
const frontUrl = process.env.NEXT_PUBLIC_API_KEY_2;

export const SIGNUP_URL = `${frontUrl}/auth/signUp`;
export const VERIFYUSER_URL = `${frontUrl}/auth/verifyUser`;
export const FORGOT_PASSWORD_URL = `${frontUrl}/auth/forgotPassword`;
export const RESET_PASSWORD_URL = `${frontUrl}/auth/resetPassword`;
export const LOGIN_URL = `${frontUrl}/auth/login`;
export const ACCEPTINVITATION_URL = `${frontUrl}/auth/acceptInvitaion`;



export const signUp = async (first_name, last_name, email, password, reCaptchaToken) => {
  return await axios
    .post(SIGNUP_URL, { first_name, last_name, email, password, reCaptchaToken })
    .then((response) => {
      console.log("response success  :", response);
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}
export const verifyUser = async (verificationToken) => {
  return await axios
    .post(VERIFYUSER_URL, { verificationToken })
    .then((response) => {
      console.log("response success  :", response);
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}
export const forgotPassword = async (email) => {
  return await axios
    .post(FORGOT_PASSWORD_URL, { email })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}
export const resetPassword = async (resetToken, newPassword) => {
  return await axios
    .post(RESET_PASSWORD_URL, { resetToken, newPassword })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}

export const logIn = async (email, password, reCaptchaToken, remember_me ) => {
  return await axios
    .post(LOGIN_URL, { email, password, reCaptchaToken, remember_me })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}

export const acceptInvitation = async (invitationToken, password) => {
  return await axios
    .post(ACCEPTINVITATION_URL, { invitationToken, password })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}


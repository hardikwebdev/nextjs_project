import axios from "axios";
const apiUrl = process.env.API_KEY;

export const LOGIN_URL = `${apiUrl}/auth/login`;
export const FORGOT_PASSWORD_URL = `${apiUrl}/auth/forgotPassword`;
export const OTP_SUBMIT_URL = `${apiUrl}/auth/verifyLogin`;
export const RESEND_OTP_URL = `${apiUrl}/auth/resendOtp`;
export const RESET_PASSWORD_URL = `${apiUrl}/auth/resetPassword`;


export const login = async (email, password) => {
  return await axios
    .post(LOGIN_URL, { email, password })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}

export const requestPassword = async (email) => {
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

export const otpSubmit = async (email, otp) => {
  return await axios
    .post(OTP_SUBMIT_URL, { email, otp })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}

export const resendOtp = async (email) => {
  return await axios
    .post(RESEND_OTP_URL, { email })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}

export const resetPassword = async (email, newPassword, resetToken,) => {
  return await axios
    .post(RESET_PASSWORD_URL, { email, newPassword, resetToken, })
    .then((response) => {
      console.log("response success  :", response); // Log the response data to the console
      return response;
    })
    .catch((error) => {
      console.log("error response : ", error);
      throw error
    });
}
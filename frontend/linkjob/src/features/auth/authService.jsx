import axios from "axios";

// const BACKEND_DOMAIN = "http://localhost:8000";
const BACKEND_DOMAIN = "http://da7ye.pythonanywhere.com"; // after deployment

// const BACKEND_DOMAIN = "http://192.168.1.113:8000"; // for phone testing purposes

const REGISTER_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/`;
const LOGIN_URL = `${BACKEND_DOMAIN}/api/v1/auth/jwt/create/`;
const ACTIVATE_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/activation/`;
const RESET_PASSWORD_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password/`;
const RESET_PASSWORD_CONFIRM_URL = `${BACKEND_DOMAIN}/api/v1/auth/users/reset_password_confirm/`;
const GET_USER_INFO = `${BACKEND_DOMAIN}/api/v1/auth/users/me/`;

// Helper function to validate token
const validateToken = (token) => {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;

    return decodedToken.exp > currentTime;
};

// Register user
const register = async (userData) => {
    const config = { headers: { "Content-type": "application/json" } };
    const response = await axios.post(REGISTER_URL, userData, config);
    return response.data;
};

// Login user
const login = async (userData) => {
    const config = { headers: { "Content-type": "application/json" } };
    const response = await axios.post(LOGIN_URL, userData, config);

    if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
    }

    return response.data;
};

// Logout user
const logout = () => {
    localStorage.removeItem("user");
};

// Activate user
const activate = async (userData) => {
    const config = { headers: { "Content-type": "application/json" } };
    const response = await axios.post(ACTIVATE_URL, userData, config);
    return response.data;
};

// Reset Password
const resetPassword = async (userData) => {
    const config = { headers: { "Content-type": "application/json" } };
    const response = await axios.post(RESET_PASSWORD_URL, userData, config);
    return response.data;
};

// Confirm Reset Password
const resetPasswordConfirm = async (userData) => {
    const config = { headers: { "Content-type": "application/json" } };
    const response = await axios.post(RESET_PASSWORD_CONFIRM_URL, userData, config);
    return response.data;
};

// Get User Info
const getUserInfo = async (accessToken) => {
    if (!validateToken(accessToken)) {
        logout(); // Clear the token if it's invalid or expired
        throw new Error("Invalid or expired token");
    }

    const config = { headers: { "Authorization": `Bearer ${accessToken}` } };
    const response = await axios.get(GET_USER_INFO, config);
    return response.data;
};

const authService = { register, login, logout, activate, resetPassword, resetPasswordConfirm, getUserInfo };

export default authService;

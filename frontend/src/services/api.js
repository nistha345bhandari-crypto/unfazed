import axios from "axios";

const API = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://127.0.0.1:5000/api",
});

API.interceptors.request.use((config) => {

    // Only add a token if the request hasn't already provided one
    if (!config.headers.Authorization) {

        const patientToken =
            localStorage.getItem("patientToken");

        const therapistToken =
            localStorage.getItem("therapistToken");

        const token =
            patientToken || therapistToken;

        if (token) {
            config.headers.Authorization =
                `Bearer ${token}`;
        }
    }

    return config;
});

export default API;
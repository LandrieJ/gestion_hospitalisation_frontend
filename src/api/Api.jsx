import axios from "axios";

axios.defaults.withCredentials = true;

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

async function fetchCsrfToken() {
    try {
        const response = await api.get("comptes/get-csrf-token/");
        const csrfToken = response.data.csrfToken;

        if (csrfToken) {
            localStorage.setItem("csrftoken", csrfToken);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération du CSRF token :", error);
    }
}


fetchCsrfToken();

api.interceptors.request.use(
    (config) => {
        const csrfToken = localStorage.getItem("csrftoken");
        if (csrfToken) {
            config.headers["X-CSRFToken"] = csrfToken;
        } else {
            console.warn("CSRF Token introuvable !");
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;

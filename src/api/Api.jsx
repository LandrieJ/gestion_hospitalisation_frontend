
import axios from "axios";

const api = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Récupération du CSRF Token
let csrfPromise = null;

async function fetchCsrfToken() {
    try {
        const response = await api.get("comptes/get-csrf-token/");
        const csrfToken = response.data.csrfToken;

        if (csrfToken) {
            localStorage.setItem("csrftoken", csrfToken);
        }

        return csrfToken;
    } catch (error) {
        console.error("Erreur récupération CSRF :", error);
        throw error;
    }
}

// Intercepteur des requêtes
api.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase();

        if (["post", "put", "patch", "delete"].includes(method)) {
            let csrfToken = localStorage.getItem("csrftoken");

            if (!csrfToken) {
                if (!csrfPromise) {
                    csrfPromise = fetchCsrfToken()
                        .finally(() => {
                            csrfPromise = null;
                        });
                }

                csrfToken = await csrfPromise;
            }

            if (csrfToken) {
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;

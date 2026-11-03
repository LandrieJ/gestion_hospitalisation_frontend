import axios from "axios";

const api = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

let csrfPromise = null;

// Récupération du token CSRF
export const fetchCsrfToken = async (forceRefresh = false) => {
    if (forceRefresh) {
        localStorage.removeItem("csrftoken");
        csrfPromise = null;
    }

    if (!csrfPromise) {
        csrfPromise = api
            .get("/comptes/get-csrf-token/")
            .then((response) => {
                const csrfToken = response.data?.csrfToken;

                if (!csrfToken) {
                    throw new Error("Token CSRF introuvable.");
                }

                localStorage.setItem("csrftoken", csrfToken);
                return csrfToken;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }

    return csrfPromise;
};

// Intercepteur des requêtes
api.interceptors.request.use(async (config) => {
    const method = config.method?.toLowerCase();

    const protectedMethods = ["post", "put", "patch", "delete"];

    if (protectedMethods.includes(method)) {
        let csrfToken = localStorage.getItem("csrftoken");

        if (!csrfToken) {
            csrfToken = await fetchCsrfToken();
        }

        config.headers = config.headers || {};
        config.headers["X-CSRFToken"] = csrfToken;
    }

    return config;
});

// Intercepteur des réponses
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 403 &&
            originalRequest &&
            !originalRequest._csrfRetry &&
            ["post", "put", "patch", "delete"].includes(
                originalRequest.method?.toLowerCase()
            )
        ) {
            originalRequest._csrfRetry = true;

            try {
                const newToken = await fetchCsrfToken(true);

                originalRequest.headers["X-CSRFToken"] = newToken;

                return api(originalRequest);
            } catch (csrfError) {
                localStorage.removeItem("csrftoken");
                return Promise.reject(csrfError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
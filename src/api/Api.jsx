
import axios from "axios";

const api = axios.create({
    baseURL: "/",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// ==========================================
// GESTION DU TOKEN CSRF
// ==========================================

let csrfPromise = null;

/**
 * Récupération du token CSRF depuis Django.
 */
export const fetchCsrfToken = async (forceRefresh = false) => {
    // Éviter de réutiliser un ancien token si actualisation demandée
    if (forceRefresh) {
        localStorage.removeItem("csrftoken");
        csrfPromise = null;
    }

    // Éviter plusieurs appels simultanés
    if (!csrfPromise) {
        csrfPromise = api
            .get("comptes/get-csrf-token/")
            .then((response) => {
                const csrfToken = response.data?.csrfToken;

                if (!csrfToken) {
                    throw new Error("Token CSRF introuvable dans la réponse Django.");
                }

                localStorage.setItem("csrftoken", csrfToken);

                return csrfToken;
            })
            .catch((error) => {
                console.error(
                    "Erreur lors de la récupération du CSRF Token :",
                    error.response?.data || error.message
                );

                throw error;
            })
            .finally(() => {
                csrfPromise = null;
            });
    }

    return csrfPromise;
};

// ==========================================
// INTERCEPTEUR DES REQUÊTES
// ==========================================

api.interceptors.request.use(
    async (config) => {
        const method = config.method?.toLowerCase();

        const protectedMethods = [
            "post",
            "put",
            "patch",
            "delete",
        ];

        if (protectedMethods.includes(method)) {
            let csrfToken = localStorage.getItem("csrftoken");

            // Récupérer le token si absent
            if (!csrfToken) {
                csrfToken = await fetchCsrfToken();
            }

            // Ajouter le token dans les headers
            if (csrfToken) {
                config.headers = config.headers || {};
                config.headers["X-CSRFToken"] = csrfToken;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ==========================================
// INTERCEPTEUR DES RÉPONSES
// ==========================================

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si Django refuse le CSRF avec un 403,
        // récupérer un nouveau token et réessayer une seule fois.
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

                originalRequest.headers =
                    originalRequest.headers || {};

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

// ==========================================
// EXPORT
// ==========================================

export default api;

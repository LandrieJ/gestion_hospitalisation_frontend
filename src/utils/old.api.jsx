

// export const createMouvement = async (formData) => {
//     try {
//         const response = await api.post(`logistique/mouvements/`, formData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la création du mouvement");
//         console.log(error.response?.data || error.message);
//     }
// };
// export const createArticle = async (formData) => {
//     try {
//         const response = await api.post(`logistique/articles/`, formData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la création de l'article");
//     }
// };
//=====================LOGISTIQUE API SERVICES=====================
// export const createTypeArticle = async (formData) => {
//     try {
//         const response = await api.post(`logistique/types-articles/`, formData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la création du type d'article");
//     }
// };
/**
//  * POST pour le dossier traumatologie
//  * @return {Promise<Array>}
//  */
// export const createTraumatologieRecord = async (formData) => {
//     try {
//         const response = await api.post(`traumatologie/traumatologie-dossiers/`, formData);
//         return response.data;
//     } catch (error) {
//         console.error("Détails de l'erreur API :", error.response?.data || error.message);
//         handleError(error, "Erreur lors de la création du dossier de traumatologie", error.response?.data || error.message);
//     }
// };
// /**
//  * Ajout d'un patient
//  * @param {object} newData
//  */
// export const AjoutPatient = async (newData) => {
//   try {
//     const response = await api.post('patient/', newData);
//     return response.data;
//   } catch (error) {
//     console.error("Détails de l'erreur API :", error.response?.data || error.message);
//     handleError(error, "Erreur lors de l'ajout du patient");
//   }
// }
// /**
//  * Création des hôpitaux
//  * @param {Object} hospitalData - Les données de l'hôpital
//  */
// export const createHospital = async (hospitalData) => {
//     try {
//         const response = await api.post('comptes/hospitals/', hospitalData);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la création de l\'hôpital');
//     }
// }
// /**
//  * Création d'un utilisateur 
//  * @param {Object} userData 
//  * @returns 
//  */
// export const createUser = async (userData) => {
//     try {
//         const response = await api.post("comptes/users/", userData);
//         return response.data;
//     } catch (error) {
//         if (error.response && error.response.data) {
//             console.error("Erreur de validation côté serveur :", error.response.data);
//         } else {
//             console.error("Erreur inconnue :", error);
//         }
//         handleError(error, "Erreur lors de la création de l'utilisateur");
//     }
// };


// // Réinitialisation du mot de passe
// /**
//  * @param {string} email - L'email de l'utilisateur
// */
// export const passwordReset = async (email) => {
//     try {
//         const response = await api.post('comptes/password-reset/', { email });
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la demande de réinitialisation du mot de passe');
//     }
// };
// /**
//  * Connexion de l'utilisateur
//  * @param {string} email - L'email de l'utilisateur
//  * @param {string} password - Le mot de passe de l'utilisateur
//  * @return {Promise<Object>} - Les données de l'utilisateur connecté
//  */
// export const login = async (email, password) => {
//     try {
//         const response = await api.post('comptes/login/', { email, password }, { withCredentials: true });
//         return response.data;
//     } catch (error) {
//         handleError(error, "Une erreur s'est produite lors de la connexion");
//     }
// };

// /**
//  * Déconnexion de l'utilisateur
//  * @return {boolean} - true si la déconnexion a réussi, false sinon
//  */
// export const logout = async () => {
//     try {
//         await api.post('comptes/logout/');
//     } catch (error) {
//         handleError(error, 'Erreur lors de la déconnexion');
//     }
// };
// export const createFournisseur = async (formData) => {
//     try {
//         const response = await api.post(`logistique/fournisseurs/`, formData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la création du fournisseur");
//     }
// };
// export const fetchFournisseurs = async () => {
//     try {
//         const response = await api.get(`logistique/fournisseurs/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération des fournisseurs");
//     }
// };
// export const fetchFournisseursById = async (id) => {
//     try {
//         const response = await api.get(`logistique/fournisseurs/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération du fournisseur");
//     }
// };
// export const updateFournisseur = async (id, updatedData) => {
//     try {
//         const response = await api.patch(`logistique/fournisseurs/${id}/`, updatedData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la mise à jour du fournisseur");
//     }
// };
// export const deleteFournisseur = async (id) => {
//     try {
//         await api.delete(`logistique/fournisseurs/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression du fournisseur");
//     }
// };
// export const fetchMouvements = async () => {
//     try {
//         const response = await api.get(`logistique/mouvements/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération des mouvements");
//     }
// };
// export const fetchArticles = async () => {
//     try {
//         const response = await api.get(`logistique/articles/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération des articles");
//     }
// };
// export const fetchTypeArticles = async () => {
//     try {
//         const response = await api.get(`logistique/types-articles/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération des types d'articles");
//     }
// };
// /**
//  * Ajoute une nouvelle ressource à un utilisateur (Éducation, Spécialité, Horaire, etc.)
//  * @param {string} resourceType - Le type de ressource ("education", "specialite", "horaires")
//  * @param {number} userId - L'ID de l'utilisateur
//  * @param {Object} newData - Les données de la nouvelle ressource
//  */
// export const addUserResource = async (resourceType, userId, newData) => {
//     try {
//         const formData = new FormData();

//         // Ajouter uniquement les données valides
//         Object.keys(newData).forEach((key) => {
//             if (newData[key] !== undefined && newData[key] !== null) {
//                 formData.append(key, newData[key]);
//             }
//         });

//         // Envoi de la requête API pour ajouter la ressource
//         const response = await api.post(
//             `comptes/users/${userId}/${resourceType}/`,
//             formData,
//             { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         return response.data; // Retourner les données de la nouvelle ressource
//     } catch (error) {
//         handleError(error, `Erreur lors de l'ajout de ${resourceType}`);
//     }
// };

// /**
//  * Récupération des patients
//  * @return {Promise<Array>} - Liste des patients
//  */
// export const fetchPatients = async () => {
//     try {
//         const response = await api.get('patient/');
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la récupération des patients');
//     }
// }
// /**
//  * Vérifie si l'utilisateur est authentifié par session
//  * @return {Promise<Object|null>} - Les données de l'utilisateur si authentifié, null sinon
//  */
// export const checkAuth = async () => {
//     try {
//         const response = await api.get('comptes/session/', { withCredentials: true });
//         return response.data;
//     } catch {
//         return null;
//     }
// };
// /**
//  * 
//  * @returns {Promise<Array>} - Liste des utilisateurs actifs
//  */
// export const fetchUsers = async () => {
//     try {
//         const response = await api.get('comptes/users/?is_active=true');
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la récupération des utilisateurs');
//     }
// };


// /**
//  * Récupération des utilisateurs inactifs
//  * @return {Promise<Array>} - Liste des utilisateurs inactifs
//  */
// export const fetchInactiveUsers = async () => {
//     try {
//         const response = await api.get('comptes/users/?is_active=false');
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la récupération des utilisateurs inactifs');
//     }
// };


// /**
//  * Récupération des utilisateurs bloqués
//  * @return {Promise<Array>} - Liste des utilisateurs bloqués
//  */
// export const fetchBlockedUsers = async () => {
//     try {
//         const response = await api.get('comptes/users/?status=blocked');
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la récupération des utilisateurs bloqués');
//     }
// };

// /** 
//  *  Récupération des hôpitaux
//  * @return {Promise<Array>} - Liste des hôpitaux
//  */
// export const fetchHospital = async () => {
//     try {
//         const response = await api.get('comptes/hospitals/');
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la récupération des hôpitaux');
//     }
// };
// /**
//  * @param {number} id - L'ID de l'hôpital à supprimer
//  */
// export const deleteHospital = async (id) => {
//     try {
//         await api.delete(`comptes/hospitals/${id}/`);
//     } catch (error) {
//         handleError(error, 'Erreur lors de la suppression de l\'hôpital');
//     }
// }
// /**
//  * Update d'un hôpital
//  * @param {number} id - L'ID de l'hôpital à mettre à jour
//  */
// export const updateHospital = async (id, hospitalData) => {
//     try {
//         const response = await api.patch(`comptes/hospitals/${id}/`, hospitalData);
//         return response.data;
//     } catch (error) {
//         handleError(error, 'Erreur lors de la mise à jour de l\'hôpital');
//     }
// }
// /**
//  * Récupère les informations d'un utilisateur par son ID
//  * @param {number} id - L'ID de l'utilisateur
//  * @return {Promise<Object>} - Les données de l'utilisateur
//  */
// export const fetchUserById = async (id) => {
//     try {
//         const response = await api.get(`comptes/users/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération de l'utilisateur");
//     }
// };
// /**
//  * Met à jour les informations d'un utilisateur
//  * @param {number} id - L'ID de l'utilisateur à mettre à jour
//  * @param {Object} userData - Les nouvelles données de l'utilisateur
//  * @param {File} photoFile - Le fichier photo à télécharger (facultatif)
//  * @returns {Promise<Object>} - Les données mises à jour de l'utilisateur
//  */
// export const updateUser = async (id, userData, photoFile) => {
//     try {
//         const { groups, user_permissions, last_login, ...updatedUserData } = userData;
//         const formData = new FormData();

//         // Ajouter uniquement les données valides
//         Object.keys(updatedUserData).forEach((key) => {
//             if (updatedUserData[key] !== undefined && updatedUserData[key] !== null) {
//                 formData.append(key, updatedUserData[key]);
//             }
//         });

//         if (photoFile) {
//             formData.append("profile_picture", photoFile);
//         }

//         const response = await api.patch(`comptes/users/${id}/`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' },
//         });
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la mise à jour de l'utilisateur");
//     }
// };

// /**
//  * Supprime un utilisateur par son ID
//  * @param {number} id - L'ID de l'utilisateur à supprimer
//  */
// export const deleteUser = async (id) => {
//     try {
//         await api.delete(`comptes/users/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression de l'utilisateur");
//     }
// };
// /**
//  * Met à jour une ressource spécifique d'un utilisateur (Éducation, Spécialité, Horaire, etc.)
//  * @param {string} resourceType - Le type de ressource ("education", "specialite", "horaires")
//  * @param {number} userId - L'ID de l'utilisateur
//  * @param {number} resourceId - L'ID de la ressource à mettre à jour
//  * @param {Object} updatedData - Les nouvelles données de la ressource
//  */
// export const updateUserResource = async (resourceType, userId, resourceId, updatedData) => {
//     try {
//         const { id, ...filteredData } = updatedData;
//         const formData = new FormData();

//         Object.keys(filteredData).forEach((key) => {
//             if (filteredData[key] !== undefined && filteredData[key] !== null) {
//                 formData.append(key, filteredData[key]);
//             }
//         });

//         const response = await api.patch(
//             `comptes/users/${userId}/${resourceType}/${resourceId}/`,
//             formData,
//             { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         return response.data;
//     } catch (error) {
//         handleError(error, `Erreur lors de la mise à jour de ${resourceType}`);
//     }
// };
// /**
//  * @param {String} resourceType - Type de resource (education, specialite, horaires, etc.)
//  * @param {Number} userId - User id
//  * @param {Number} resourceId - Id du resource
//  */
// export const deleteUserResource = async (resourceType, userId, resourceId) => {
//     try {
//         await api.delete(`comptes/users/${userId}/${resourceType}/${resourceId}/`);
//     } catch (error) {
//         handleError(error, `Erreur lors de la suppression de ${resourceType}`);
//     }
// }
// /**
//  * @param {number} userId - L'id du user
//  * @param {object} updatedData - Les données à mettre à jour
//  */
// export const updateUserHoraires = async (userId, updatedData) => {
//     try {
//         const response = await api.patch(`comptes/users/${userId}/horaires/`, updatedData,
//             { headers: { "Content-Type": "application/json" } }
//         );
//         return response.data;
//     } catch (error) {
//         console.error("Erreur lors de la mise à jour des horaires :", error);
//         throw error;
//     }
// };
// /**
//  * Récupération des dossiers de traumatologie
//  * @return {Promise<Array>} - Liste des dossiers de traumatologie
//  */
// export const fetchTraumatologieRecords = async () => {
//     try {
//         const response = await api.get(`traumatologie/traumatologie-dossiers/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération des dossiers de traumatologie");
//     }
// };
// /**
//  * Récupération d'un dossier de traumatologie par son ID
//  * @param {number} id - L'ID du dossier de traumatologie
//  * @return {Promise<Object>} - Les données du dossier de traumatologie
//  */
// export const fetchTraumatologieRecordById = async (id) => {
//     try {
//         const response = await api.get(`traumatologie/traumatologie-dossiers/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération du dossier de traumatologie");
//     }
// };
// /**
//  * Mise à jour d'un dossier de traumatologie
//  * @param {number} id - L'ID du dossier de traumatologie à mettre à jour
//  * @param {Object} updatedData - Les nouvelles données du dossier de traumatologie
//  * @return {Promise<Object>} - Les données mises à jour du dossier de traumatologie
//  */
// export const updateTraumatologieRecord = async (id, updatedData) => {
//     try {
//         const response = await api.patch(`traumatologie/traumatologie-dossiers/${id}/`, updatedData);
//         return response.data;
//     } catch (error) {
//         console.error("Détails de l'erreur API :", error.response?.data || error.message);
//         handleError(error, "Erreur lors de la mise à jour du dossier de traumatologie");
//     }
// };

// /**
//  * Suppression d'un dossier de traumatologie
//  * @param {number} id - L'ID du dossier de traumatologie à supprimer
//  */
// export const deleteTraumatologieRecord = async (id) => {
//     try {
//         await api.delete(`traumatologie/traumatologie-dossiers/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression du dossier de traumatologie");
//     }
// }

// export const fetchLookupData = async (lookupdata) => {
//     try {
//         const response = await api.get(`traumatologie/${lookupdata}/`);
//         return response.data;
//     } catch (error) {
//         console.error(`Erreur lors de la récupération des données de lookup: ${lookupdata}`, error);
//     }
// };
// export const fetchTypeArticleById = async (id) => {
//     try {
//         const response = await api.get(`logistique/types-articles/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération du type d'article");
//     }
// };
// export const updateTypeArticle = async (id, updatedData) => {
//     try {
//         const response = await api.patch(`logistique/types-articles/${id}/`, updatedData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la mise à jour du type d'article");
//     }
// };
// export const deleteTypeArticle = async (id) => {
//     try {
//         await api.delete(`logistique/types-articles/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression du type d'article");
//     }
// };
// export const fetchArticleById = async (id) => {
//     try {
//         const response = await api.get(`logistique/articles/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération de l'article");
//     }
// };

// export const updateArticle = async (id, updatedData) => {
//     try {
//         const response = await api.patch(`logistique/articles/${id}/`, updatedData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la mise à jour de l'article");
//     }
// };

// export const deleteArticle = async (id) => {
//     try {
//         await api.delete(`logistique/articles/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression de l'article");
//     }
// };
// export const fetchMouvementById = async (id) => {
//     try {
//         const response = await api.get(`logistique/mouvements/${id}/`);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la récupération du mouvement");
//     }
// };
// export const updateMouvement = async (id, updatedData) => {
//     try {
//         const response = await api.patch(`logistique/mouvements/${id}/`, updatedData);
//         return response.data;
//     } catch (error) {
//         handleError(error, "Erreur lors de la mise à jour du mouvement");
//     }
// };
// export const deleteMouvement = async (id) => {
//     try {
//         await api.delete(`logistique/mouvements/${id}/`);
//     } catch (error) {
//         handleError(error, "Erreur lors de la suppression du mouvement");
//     }
// };
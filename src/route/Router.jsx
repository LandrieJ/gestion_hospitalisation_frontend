import { createBrowserRouter, Navigate, redirect, useRoutes, useLoaderData } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { ProtectedRoute, PublicRoute } from "../utils/ProtectedRoute";
import { monprofile, services, utilisateurs } from "../utils/StaticData";
import { generateServiceRoutes, getDefaultServiceRoute } from "../utils/generateServiceRoutes";
import { UserContext } from "../utils/UserContext";

// Composant de chargement
const LoadingSpinner = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
);

// Wrapper pour le Suspense
export const LazyWrapper = ({ children }) => (
    <Suspense fallback={<LoadingSpinner />}>
        {children}
    </Suspense>
);

// Pages principales avec lazy loading
const Login = lazy(() => import("../pages/Login/Login").then(module => ({ default: module.Login || module.default })));
const Register = lazy(() => import("../pages/Register/Register").then(module => ({ default: module.Register || module.default })));
const Reset = lazy(() => import("../pages/Reset/Reset").then(module => ({ default: module.Reset || module.default })));
const Accueil = lazy(() => import("../pages/Accueil/Accueil").then(module => ({ default: module.Accueil || module.default })));

// Composants internes avec lazy loading
const Index = lazy(() => import("../components/index/Index").then(module => ({ default: module.Index || module.default })));
//const Compte = lazy(() => import("../components/compte/Compte").then(module => ({ default: module.Compte || module.default })));
const Compte = lazy(() =>
  import("../components/compte/Compte.jsx").then((module) => ({
    default: module.Compte || module.default,
  }))
);
const InfoPersonelle = lazy(() => import("../pages/monprofile/InfoPersonelle").then(module => ({ default: module.InfoPersonelle || module.default })));

// Utilisateurs avec lazy loading
const Utilisateur = lazy(() => import("../components/Utilisateur/utilisateur").then(module => ({ default: module.Utilisateur || module.default })));
const Liste = lazy(() => import("../components/Utilisateur/Liste/Liste").then(module => ({ default: module.Liste || module.default })));
const Detail = lazy(() => import("../components/Utilisateur/Liste/Detail/Detail").then(module => ({ default: module.Detail || module.default })));
const Demande = lazy(() => import("../components/Utilisateur/Demande/Demande").then(module => ({ default: module.Demande || module.default })));
const Bloque = lazy(() => import("../components/Utilisateur/Bloque/Bloque").then(module => ({ default: module.Bloque || module.default })));

// Autres composants avec lazy loading
const Service = lazy(() => import("../components/Service/Service").then(module => ({ default: module.Service || module.default })));
const InfoProfessionnelle = lazy(() => import("../pages/monprofile/InfoProfessionnelle").then(module => ({ default: module.InfoProfessionnelle || module.default })));
const Biographie = lazy(() => import("../pages/monprofile/Biographie").then(module => ({ default: module.Biographie || module.default })));
const Education = lazy(() => import("../pages/monprofile/Education").then(module => ({ default: module.Education || module.default })));
const Specialites = lazy(() => import("../pages/monprofile/Specialites").then(module => ({ default: module.Specialites || module.default })));
const HoraireTravail = lazy(() => import("../pages/monprofile/HoraireTravail").then(module => ({ default: module.HoraireTravail || module.default })));
const Hospital = lazy(() => import("../components/Hospital/Hospital").then(module => ({ default: module.Hospital || module.default })));

// Composant pour routes dynamiques des services
const DynamicServices = () => {
  const { serviceRoutes } = useLoaderData();
  const routesElement = useRoutes(serviceRoutes);
  return routesElement; // Si pas de match, returns null - vous pouvez ajouter un fallback comme <NotFound /> si nécessaire
};

export const RoleRoute = ({ allowedRoles, children }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.user_type)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Loader pour les routes de services
const serviceLoader = async () => {
    const serviceRoutes = await generateServiceRoutes();
    const defaultServiceRoute = await getDefaultServiceRoute();
    return { serviceRoutes, defaultServiceRoute };
};

const ROUTES = {
    ACCUEIL: "",
    LOGIN: "login",
    STATISTIQUE: "statistique",
    REGISTER: "register",
    RESET: "reset",
    UTILISATEUR: "utilisateur",
    SERVICE: "service",
    MONPROFILE: "monprofile",
    HOSPITAL: "hospital",
    NOT_FOUND: "*",
};

const router = createBrowserRouter([
    {
        path: ROUTES.REGISTER,
        element: (
            <PublicRoute>
                <LazyWrapper>
                    <Register />
                </LazyWrapper>
            </PublicRoute>
        )
    },
    {
        path: ROUTES.LOGIN,
        element: (
            <PublicRoute>
                <LazyWrapper>
                    <Login />
                </LazyWrapper>
            </PublicRoute>
        )
    },
    {
        path: ROUTES.RESET,
        element: (
            <PublicRoute>
                <LazyWrapper>
                    <Reset />
                </LazyWrapper>
            </PublicRoute>
        )
    },

    {
        path: ROUTES.ACCUEIL,
        element: (
            <ProtectedRoute>
                <LazyWrapper>
                    <Accueil />
                </LazyWrapper>
            </ProtectedRoute>
        ),
        handle: { title: "Accueil" },
        children: [
            {
                index: true,
                element: (
                    <LazyWrapper>
                        <Index />
                    </LazyWrapper>
                )
            },
            {
                path: "compte",
                handle: { title: "Mon Compte" },
                element: (
                    <LazyWrapper>
                        <Compte />
                    </LazyWrapper>
                )
            },
            {
                path: ROUTES.MONPROFILE,
                loader: () => monprofile,
                handle: { title: "Mon profile" },
                children: [
                    {
                        index: true,
                        handle: { title: "Paramètres" },
                        element: <Navigate to="info-personnelle" replace />
                    },
                    {
                        path: "info-personnelle",
                        handle: { title: "Info personnelles" },
                        element: (
                            <LazyWrapper>
                                <InfoPersonelle />
                            </LazyWrapper>
                        )
                    },
                    {
                        path: "info-professionnelle",
                        handle: { title: "Info professionnelles" },
                        element: (
                            <LazyWrapper>
                                <InfoProfessionnelle />
                            </LazyWrapper>
                        )
                    },
                    {
                        path: "biographie",
                        handle: { title: "Biographie" },
                        element: (
                            <LazyWrapper>
                                <Biographie />
                            </LazyWrapper>
                        )
                    },
                    {
                        path: "educ-certific",
                        handle: { title: "Éducation" },
                        element: (
                            <LazyWrapper>
                                <Education />
                            </LazyWrapper>
                        )
                    },
                    {
                        path: "special-competence",
                        handle: { title: "Spécialités" },
                        element: (
                            <LazyWrapper>
                                <Specialites />
                            </LazyWrapper>
                        )
                    },
                    {
                        path: "horaire",
                        handle: { title: "Horaires de travail" },
                        element: (
                            <LazyWrapper>
                                <HoraireTravail />
                            </LazyWrapper>
                        )
                    },
                ]
            },
            {
                path: ROUTES.SERVICE,
                loader: () => services, // Loader statique pour les services (optionnel, peut être retiré si non utilisé)
                handle: { title: "Service" },
                element: (
                    <LazyWrapper>
                        <Service />
                    </LazyWrapper>
                ),
                children: [
                    {
                        index: true,
                        loader: async () => {
                            const { defaultServiceRoute } = await serviceLoader();
                            return redirect(defaultServiceRoute);
                        },
                    },
                    {
                        path: "*",
                        loader: serviceLoader,
                        element: (
                            <LazyWrapper>
                                <DynamicServices />
                            </LazyWrapper>
                        ),
                    },
                ]
            },
            {
                path: ROUTES.UTILISATEUR,
                loader: () => utilisateurs,
                handle: { title: "Utilisateur" },
                element: (
                    <LazyWrapper>
                        <Utilisateur />
                    </LazyWrapper>
                ),
                children: [
                    {
                        index: true,
                        handle: { title: "Liste des personnels" },
                        element: <Navigate to="liste" replace />
                    },
                    {
                        path: "liste",
                        handle: { title: "Personnel" },
                        children: [
                            {
                                index: true,
                                handle: { title: "Personnel" },
                                element: (
                                    <RoleRoute allowedRoles={["super_admin", "admin"]}>
                                        <LazyWrapper>
                                            <Liste />
                                        </LazyWrapper>
                                    </RoleRoute>
                                )
                            },
                            {
                                path: ":id/detail",
                                handle: { title: "Détail" },
                                element: (
                                    <RoleRoute allowedRoles={["super_admin", "admin"]}>
                                        <LazyWrapper>
                                            <Detail />
                                        </LazyWrapper>
                                    </RoleRoute>
                                )
                            },
                        ]
                    },
                    {
                        path: "demande",
                        handle: { title: "Demande" },
                        element: (
                            <RoleRoute allowedRoles={["super_admin", "admin"]}>
                                <LazyWrapper>
                                    <Demande />
                                </LazyWrapper>
                            </RoleRoute>
                        )
                    },
                    {
                        path: "bloque",
                        handle: { title: "Bloqué" },
                        element: (
                            <RoleRoute allowedRoles={["super_admin", "admin"]}>
                                <LazyWrapper>
                                    <Bloque />
                                </LazyWrapper>
                            </RoleRoute>
                        )
                    },
                ],
            },
            {
                path: ROUTES.HOSPITAL,
                handle: { title: "Hôpital" },
                element: (
                    <LazyWrapper>
                        <Hospital />
                    </LazyWrapper>
                ),
            }
        ],
    },

    { path: ROUTES.NOT_FOUND, element: <Navigate to="/login" replace /> },
]);

export default router;
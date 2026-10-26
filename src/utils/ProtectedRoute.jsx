import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext";

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const PublicRoute = ({ children }) => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return children;
};
import { useEffect } from "react";
import { useMatches } from "react-router-dom";

export const useHandleTitle = () => {

    const matches = useMatches();
    useEffect(() => {
        const currentRoute = matches.find((route) => route.data) || [];
        if (currentRoute) {
            const title = currentRoute.handle?.title || 'Accueil';
            if (title) {
                document.title = `${title} | Gestion de CHU`;
            }
        }
    }, [matches]);
}

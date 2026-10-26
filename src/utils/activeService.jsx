import { useLocation, useMatches } from "react-router-dom";
import { useMemo } from "react";

export function useActiveService() {
  const matches = useMatches();
  const location = useLocation();

  const data = useMemo(() => {
    const currentMatch = matches.find(match => match.data);
    return currentMatch ? currentMatch.data : [];
  }, [matches]);

  const pathSegments = location.pathname.split("/"); 
  const currentServiceId = pathSegments[2];

  const activeService = data.find(
    (s) => s.id === currentServiceId || s.link.includes(currentServiceId)
  );
  return activeService || null;
}

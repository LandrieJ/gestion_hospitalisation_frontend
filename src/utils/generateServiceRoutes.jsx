// utils/generateServiceRoutes.js
import { lazy, Suspense } from "react";
import { services } from "./StaticData";
import { apiTogetAll } from "./ApiServices";
import { Navigate } from "react-router-dom";

// Wrapper pour le Suspense
const LazyWrapper = ({ children }) => (
  <Suspense fallback={
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
    </div>
  }>
    {children}
  </Suspense>
);

// Composants lazy par défaut pour les services qui n'ont pas de composants spécifiques
const DefaultService = lazy(() => import("../components/Service/DefaultService").then(module => ({ default: module.DefaultService || module.default })));
const DefaultSubService = lazy(() => import("../components/Service/DefaultSubService").then(module => ({ default: module.DefaultSubService || module.default })));

// Mapping des composants spécifiques existants
const serviceComponents = {
  // Logistique - composants existants
  'logistique': lazy(() => import("../components/Service/Logistique/Logistique").then(module => ({ default: module.Logistique || module.default }))),
  'logistique/article': lazy(() => import("../components/Service/Logistique/Article/Article").then(module => ({ default: module.Article || module.default }))),
  'logistique/commande': lazy(() => import("../components/Service/Logistique/Commande/Commande").then(module => ({ default: module.Commande || module.default }))),
  
  // Traumatologie - composants existants (réutilisés pour les sous-menus communs)
  'traumatologie/patients': lazy(() => import("../components/Service/Traumatologie/Patient/Patient").then(module => ({ default: module.Patient || module.default }))),
  'traumatologie/dossier': lazy(() => import("../components/Service/Traumatologie/Dossier/Dossier").then(module => ({ default: module.Dossier || module.default }))),
};

// Fonction pour récupérer et filtrer les services disponibles pour l'utilisateur
export const getFilteredServices = async () => {
  try {
    const servicesData = await apiTogetAll('services/lists/');
    const userServices = servicesData.results;
    
    // Filtrer les services selon les permissions utilisateur
    const filteredServices = services.filter(service => userServices.some(us => us.name === service.id));
    
    return filteredServices;
  } catch (error) {
    console.error('Erreur lors de la récupération des services:', error);
    return services; // Retourner tous les services en cas d'erreur
  }
};

// Fonction pour obtenir le composant approprié
const getServiceComponent = (serviceId, subPath = '', childText = '') => {
  // Si le sous-menu est "Dossier médical" ou "Gestion des patients", utiliser les composants de traumatologie
  if (childText === 'Dossier médical') {
    return serviceComponents['traumatologie/dossier'];
  }
  if (childText === 'Gestion des patients') {
    return serviceComponents['traumatologie/patients'];
  }
  
  // Sinon, utiliser le composant spécifique ou par défaut
  const fullPath = subPath ? `${serviceId}/${subPath}` : serviceId;
  return serviceComponents[fullPath] || DefaultSubService;
};

// Fonction pour générer les routes des sous-services
const generateSubServiceRoutes = (service) => {
  if (!service.children || service.children.length === 0) {
    return [];
  }

  const routes = service.children.map((child, index) => {
    const pathParts = child.link.split('/');
    const subPath = pathParts[pathParts.length - 1];
    const Component = getServiceComponent(service.id, subPath, child.text); // Passer child.text pour vérifier
    
    return {
      path: subPath,
      handle: { title: child.text },
      element: (
        <LazyWrapper>
          <Component />
        </LazyWrapper>
      )
    };
  });

  // Ajouter une route index qui redirige vers le premier sous-service
  if (routes.length > 0) {
    const firstSubPath = service.children[0].link.split('/').pop();
    routes.unshift({
      index: true,
      element: <Navigate to={firstSubPath} replace />
    });
  }

  return routes;
};

// Fonction principale pour générer toutes les routes de services (avec filtrage automatique)
export const generateServiceRoutes = async () => {
  // Récupérer les services filtrés pour l'utilisateur
  const filteredServices = await getFilteredServices();
  
  return filteredServices.map(service => {
    const ServiceComponent = serviceComponents[service.id] || DefaultService;
    const hasChildren = service.children && service.children.length > 0;
    
    const route = {
      path: service.id,
      handle: { title: service.text },
      element: (
        <LazyWrapper>
          <ServiceComponent />
        </LazyWrapper>
      )
    };

    // Si le service a des enfants, ajouter les routes des sous-services
    if (hasChildren) {
      route.children = generateSubServiceRoutes(service);
    }

    return route;
  });
};

// Fonction pour obtenir la route par défaut (premier service disponible pour l'utilisateur)
export const getDefaultServiceRoute = async () => {
  // Récupérer les services filtrés pour l'utilisateur
  const filteredServices = await getFilteredServices();
  
  if (filteredServices.length === 0) return 'traumatologie/dossier';
  
  const firstService = filteredServices[0];
  if (firstService.children && firstService.children.length > 0) {
    // Retourner le chemin du premier sous-service du premier service
    const firstChild = firstService.children[0];
    return firstChild.link.replace('service/', '');
  }
  
  // Si pas d'enfants, retourner juste l'id du service
  return firstService.id;
};





// // utils/generateServiceRoutes.js
// import { lazy, Suspense } from "react";
// import { services } from "./StaticData";
// import { apiTogetAll } from "./ApiServices";
// import { Navigate } from "react-router-dom";

// // Wrapper pour le Suspense
// const LazyWrapper = ({ children }) => (
//   <Suspense fallback={
//     <div className="flex items-center justify-center min-h-screen">
//       <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
//     </div>
//   }>
//     {children}
//   </Suspense>
// );

// // Composants lazy par défaut pour les services qui n'ont pas de composants spécifiques
// const DefaultService = lazy(() => import("../components/Service/DefaultService").then(module => ({ default: module.DefaultService || module.default })));
// const DefaultSubService = lazy(() => import("../components/Service/DefaultSubService").then(module => ({ default: module.DefaultSubService || module.default })));

// // Mapping des composants spécifiques existants
// const serviceComponents = {
//   // Logistique - composants existants
//   'logistique': lazy(() => import("../components/Service/Logistique/Logistique").then(module => ({ default: module.Logistique || module.default }))),
//   'logistique/article': lazy(() => import("../components/Service/Logistique/Article/Article").then(module => ({ default: module.Article || module.default }))),
//   'logistique/commande': lazy(() => import("../components/Service/Logistique/Commande/Commande").then(module => ({ default: module.Commande || module.default }))),
  
//   // Traumatologie - composants existants
//   'traumatologie/patients': lazy(() => import("../components/Service/Traumatologie/Patient/Patient").then(module => ({ default: module.Patient || module.default }))),
//   'traumatologie/dossier': lazy(() => import("../components/Service/Traumatologie/Dossier/Dossier").then(module => ({ default: module.Dossier || module.default }))),
  

// };


// // Fonction pour récupérer et filtrer les services disponibles pour l'utilisateur
// export const getFilteredServices = async () => {
//   try {
//     const servicesData = await apiTogetAll('services/lists');
//     const userServices = servicesData.results;
    
//     // Filtrer les services selon les permissions utilisateur
//     const filteredServices = services.filter(service => userServices.some(us => us.name === service.id));
    
//     return filteredServices;
//   } catch (error) {
//     console.error('Erreur lors de la récupération des services:', error);
//     return services; // Retourner tous les services en cas d'erreur
//   }
// };

// // Fonction pour obtenir le composant approprié
// const getServiceComponent = (serviceId, subPath = '') => {
//   const fullPath = subPath ? `${serviceId}/${subPath}` : serviceId;
//   return serviceComponents[fullPath] || DefaultSubService;
// };

// // Fonction pour générer les routes des sous-services
// const generateSubServiceRoutes = (service) => {
//   if (!service.children || service.children.length === 0) {
//     return [];
//   }

//   const routes = service.children.map((child, index) => {
//     const pathParts = child.link.split('/');
//     const subPath = pathParts[pathParts.length - 1];
//     const Component = getServiceComponent(service.id, subPath);
    
//     return {
//       path: subPath,
//       handle: { title: child.text },
//       element: (
//         <LazyWrapper>
//           <Component />
//         </LazyWrapper>
//       )
//     };
//   });

//   // Ajouter une route index qui redirige vers le premier sous-service
//   if (routes.length > 0) {
//     const firstSubPath = service.children[0].link.split('/').pop();
//     routes.unshift({
//       index: true,
//       element: <Navigate to={firstSubPath} replace />
//     });
//   }

//   return routes;
// };

// // Fonction principale pour générer toutes les routes de services (avec filtrage automatique)
// export const generateServiceRoutes = async () => {
//   // Récupérer les services filtrés pour l'utilisateur
//   const filteredServices = await getFilteredServices();
  
//   return filteredServices.map(service => {
//     const ServiceComponent = serviceComponents[service.id] || DefaultService;
//     const hasChildren = service.children && service.children.length > 0;
    
//     const route = {
//       path: service.id,
//       handle: { title: service.text },
//       element: (
//         <LazyWrapper>
//           <ServiceComponent />
//         </LazyWrapper>
//       )
//     };

//     // Si le service a des enfants, ajouter les routes des sous-services
//     if (hasChildren) {
//       route.children = generateSubServiceRoutes(service);
//     }

//     return route;
//   });
// };

// // Fonction pour obtenir la route par défaut (premier service disponible pour l'utilisateur)
// export const getDefaultServiceRoute = async () => {
//   // Récupérer les services filtrés pour l'utilisateur
//   const filteredServices = await getFilteredServices();
  
//   if (filteredServices.length === 0) return 'traumatologie/dossier';
  
//   const firstService = filteredServices[0];
//   if (firstService.children && firstService.children.length > 0) {
//     // Retourner le chemin du premier sous-service du premier service
//     const firstChild = firstService.children[0];
//     return firstChild.link.replace('service/', '');
//   }
  
//   // Si pas d'enfants, retourner juste l'id du service
//   return firstService.id;
// };
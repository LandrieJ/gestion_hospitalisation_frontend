import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import '@fontsource/roboto';
import { UserProvider } from './utils/UserContext.jsx';
import { RouterProvider } from 'react-router-dom';
import router from './route/Router.jsx';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <UserProvider>
            <RouterProvider router={router}>
                <App />
            </RouterProvider>
        </UserProvider>
    </StrictMode>
);
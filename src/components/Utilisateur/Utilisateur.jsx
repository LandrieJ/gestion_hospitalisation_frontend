import { Box } from '@mui/material';
import {Outlet } from 'react-router-dom';
import { useHandleTitle } from '../../utils/handleTitle';

export const Utilisateur = () => {
    useHandleTitle()
    return (
        <>
            <Outlet />
        </>
    )
}

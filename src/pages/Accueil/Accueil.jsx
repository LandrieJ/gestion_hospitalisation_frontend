import { EmergencyRounded, FolderOpenRounded, HomeRounded, LocalHospitalRounded, PeopleAltRounded, QueryStatsRounded } from '@mui/icons-material';
import { Box, IconButton, Typography, useTheme } from '@mui/material';
import { useState, useContext, useMemo } from 'react';
import { SousMenuBox, SousMenuDraw } from '../../components/SousMenu/SousMenu';
import { SideBarMenu } from '../../components/SideBarMenu/SideBarMenu';
import { MainHeader } from '../../components/MainHeader/MainHeader';
import { NavLink, Outlet, useMatches } from 'react-router-dom';
import { UserContext } from '../../utils/UserContext';

export const Accueil = () => {
    const { user } = useContext(UserContext);
    const [open, setOpen] = useState(false);
    const [hide, setHide] = useState(false);
    const handleHide = () => setHide((prevHide) => !prevHide);
    const handleDrawerOpen = () => setOpen((prevOpen) => !prevOpen);

    const matches = useMatches();

    const data = useMemo(() => {
        const currentMatch = matches.find(match => match.data);
        return currentMatch ? currentMatch.data : [];
    }, [matches]);

    const navLinks = [
        { to: '', icon: <HomeRounded fontSize="medium" />, label: 'Accueil' },
        { to: 'hospital', icon: <LocalHospitalRounded fontSize="medium" />, label: 'Hôpital' },
        { to: 'service', icon: <EmergencyRounded fontSize="medium" />, label: 'Service' },
        // { to: 'statistique', icon: <QueryStatsRounded fontSize="medium" />, label: 'Statistique' },
        ...( user.user_type === "simple_user" ? [] : [{ to: 'utilisateur', icon: <PeopleAltRounded fontSize="medium" />, label: 'Utilisateur' }]),
    ];

    return (
        <Box id={'Accueil'} className="bg-color-gray" sx={{ height: "100vh", display: "flex", flexGrow: 1 }}>
            <Box sx={{ display: 'flex' }}>
                <SideBarMenu handleDrawerOpen={handleDrawerOpen} handleOpenCloseMenu={handleHide} hide={hide}>
                    {navLinks.map(({ to, icon, label }) => (
                        <Box
                            key={to}
                            component={NavLink}
                            to={to}
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mt: 2,
                                textDecoration: 'none',
                                color: 'text.primary',
                                transition: 'all 0.3s ease-in-out',
                                '&.active': {
                                    transform: 'scale(1.1)',
                                },
                                '&:hover': {
                                    color: 'rgba(156, 39, 89, 1)',
                                    transform: 'translateY(-2px)',
                                },
                            }}
                        >
                            <IconButton color="inherit">{icon}</IconButton>
                            <Typography fontSize={12}>{label}</Typography>
                        </Box>
                    ))}
                </SideBarMenu>
                <SousMenuBox chuUser={user.hospital?.name} theData={data} hidden={data.length < 1 ? true : hide} handleOpenCloseMenu={handleHide} hide={hide} />
                <SousMenuDraw handleDrawerOpen={handleDrawerOpen} open={data.length < 1 ? false : open} chuUser={user.hospital?.name} theData={data} />
            </Box>
            <Box className='bg-color-light' sx={{
                flex: 1,
                display: "flex",
                borderTopLeftRadius: { sm: 0, md: 8 },
                borderTopRightRadius: { sm: 0, md: 8 },
                flexDirection: "column",
                mx: { xs: 0, sm: 0, md: 1 },
                pb: { xs: 10, sm: 0 },
                mt: { xs: 0, sm: 0, md: 1 },
                boxShadow: { xs: 0, sm: 0, md: 8 },
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden",
            }}>
                <MainHeader
                    userType={user?.user_type?.toUpperCase()}
                    handleDrawerOpen={handleDrawerOpen}
                    nomUtilisateur={user?.first_name?.toUpperCase() || user?.email?.toUpperCase()}
                    photoUtilisateur={user?.profile_picture ? `http://localhost:8000${user.profile_picture}` : '/userProfile.jpg'}
                    handleOpenCloseMenu={handleHide} hide={hide}
                />
                <Box  sx={{ flex: 1, p: 2, boxShadow: 1, overflow: "auto", width: "100%" }}>
                    <Outlet />
                </Box>
            </Box>
            <Box sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                width: "100%",
                px: 3,
                py: 1,
                boxShadow: "0 -2px 8px rgba(0,0,0,0.15)",
                display: { xs: 'flex', sm: 'none' },
                justifyContent: 'space-around',

            }}>
                {navLinks.map(({ to, icon, label }) => (
                    <Box
                        key={to}
                        component={NavLink}
                        to={to}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textDecoration: 'none',
                            color: 'text.primary',
                            transition: 'all 0.3s ease-in-out',
                            '&.active': {
                                transform: 'scale(1.1)',
                            },
                            '&:hover': {
                                color: 'rgba(156, 39, 89, 1)',
                                transform: 'translateY(-2px)',
                            },
                        }}
                    >
                        <IconButton color="inherit">{icon}</IconButton>
                        <Typography fontSize={12}>{label}</Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};
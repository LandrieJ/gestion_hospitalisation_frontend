import { MenuRounded, ManageAccountsRounded, PowerSettingsNewRounded } from '@mui/icons-material';
import { Avatar, Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import { apiToPost } from '../../utils/ApiServices';
import { NavLink } from 'react-router-dom';

export const MainHeader = ({
  handleDrawerOpen,
  userType,
  nomUtilisateur = 'Utilisateur',
  photoUtilisateur = '/userProfile.jpg',
  handleOpenCloseMenu,
  hide
}) => {
  const handleRole = (role) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Admin';
      case 'ADMIN':
        return 'Admin';
      case 'SIMPLE_USER':
        return 'Utilisateur simple';
      default:
        return role
    }
  }

  const handleLogout = async () => {
    await apiToPost("comptes/logout/", {});
    window.location.href = '/login';
  };

  return (
    <Box
      position="sticky"
      className="bg-color-primary"
      sx={{
        top: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 65,
        px: 1,
        width: '100%',
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box>
          <IconButton hidden={!hide} className='text-color-white' sx={{ display: { xs: 'none', sm: 'none', md: 'flex' } }} onClick={handleOpenCloseMenu} >
            <MenuRounded />
          </IconButton>
          <IconButton
            className='text-color-white'
            sx={{ display: { xs: 'flex', sm: 'flex', md: 'none' } }}
            onClick={handleDrawerOpen}
          >
            <MenuRounded />
          </IconButton>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1,
            transition: "0.3s",
            '&:hover': {
              cursor: "pointer"
            }
          }}
        >
          <Avatar
            alt="Nom Utilisateur"
            src={photoUtilisateur}
            sx={{
              width: 40,
              height: 40,
            }}
          />
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontSize={14} fontWeight="bold">{nomUtilisateur}</Typography>
            <Typography fontSize={12}>{handleRole(userType)}</Typography>
          </Box>
        </Box>

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 'auto' }}>
        <Box component={NavLink} to="/monprofile" sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title='Mon Profil' arrow>
            <IconButton
              className='text-color-white'
              sx={{ transition: '0.2s', '&:hover': { color: 'primary.main' } }}
            >
              <ManageAccountsRounded />
            </IconButton>
          </Tooltip>
        </Box>
        <Box component={NavLink} to="#" sx={{ display: 'flex', gap: 1.5 }}>
          <Tooltip title="Déconnexion" arrow>
            <IconButton
              onClick={handleLogout}
              className='text-color-white'
              sx={{ transition: '0.2s', '&:hover': { color: 'primary.main' } }}
            >
              <PowerSettingsNewRounded />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
};
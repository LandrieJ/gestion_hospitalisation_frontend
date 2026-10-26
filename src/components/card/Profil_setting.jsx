import React from 'react';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import { SettingsRounded, LogoutRounded, PersonRounded, } from '@mui/icons-material';
import MenuButton from '@mui/joy/MenuButton';
import Dropdown from '@mui/joy/Dropdown';
import { Avatar, Box } from '@mui/material';
import { Tooltip } from '@mui/material';
import { UserContext } from "../../utils/UserContext"
import { NavLink } from 'react-router-dom';

export const Profil_setting = ({ nomUtilisateur = 'Utilisateur', photoUtilisateur = '/userProfile.jpg', }) => {
  const { logoutFront } = React.useContext(UserContext);
  const handleLogout = async () => {
    try {
      await logoutFront();
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <Dropdown>
      <Tooltip title={nomUtilisateur} arrow>
        <MenuButton
          aria-label="Menu profil utilisateur"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            width: 45,
            height: 45,
            padding: 0,
            backgroundColor: 'white',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <Avatar
            alt={nomUtilisateur}
            src={photoUtilisateur}
            sx={{
              width: 40,
              height: 40,
              transition: 'transform 0.2s',
              '&:hover': { transform: 'scale(1.1)' },
            }}
          />
        </MenuButton>
      </Tooltip>
      <Menu
        placement="bottom-end"
        sx={{
          minWidth: 180,
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
          zIndex: 9999,
        }}
      >
        <Box component={NavLink} sx={{ "&": { textDecoration: 'none' } }} to={'compte'}>
          <MenuItem >
            <ListItemDecorator>
              <PersonRounded />
            </ListItemDecorator>
            <span>Mon Profil</span>
          </MenuItem>
        </Box>
        <Box component={NavLink} sx={{ "&": { textDecoration: 'none' } }} to={'parametres'}>
          <MenuItem>
            <ListItemDecorator>
              <SettingsRounded />
            </ListItemDecorator>
            <span>Paramètres</span>
          </MenuItem>
        </Box>
        <ListDivider />
        <MenuItem
          variant="soft"
          color="danger"
          onClick={handleLogout}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(255, 72, 66, 0.1)',
            },
          }}
        >
          <ListItemDecorator sx={{ color: 'inherit' }}>
            <LogoutRounded />
          </ListItemDecorator>
          <span>Déconnexion</span>
        </MenuItem>
      </Menu>
    </Dropdown>
  );
};

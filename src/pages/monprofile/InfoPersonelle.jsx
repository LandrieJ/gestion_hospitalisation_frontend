import { useContext, useState } from 'react';
import {
  PhotoCameraRounded,
  Person,
  Edit,
  EmailRounded,
  LocalPhoneRounded,
  HomeRounded,
  Badge,
  Save,
  Close,
} from '@mui/icons-material';
import {
  Avatar,
  Box,
  IconButton,
  Grid,
  Snackbar,
  Alert,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { UserContext } from '../../utils/UserContext';
import { InfoItem, InfoSection } from './SectionComponent';
import { updateUser } from '../../utils/ApiServices';

export const InfoPersonelle = () => {
  const { user, setUser } = useContext(UserContext);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const [isEditingName, setIsEditingName] = useState(false);
  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);

  const handleProfilePictureUpdate = async (file) => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/png', 'image/jpeg', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      showSnackbar('Type de fichier non autorisé', 'error');
      return;
    }

    if (file.size > maxSize) {
      showSnackbar('Fichier trop volumineux (max 5MB)', 'error');
      return;
    }

    // Appel à la fonction updateUser pour envoyer le fichier de l'image au backend
    const updatedUser = await updateUser(user.id, {}, file);
    setUser(updatedUser); // Met à jour l'utilisateur avec la nouvelle photo
    showSnackbar('Photo de profil mise à jour', 'success');
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSaveName = async () => {
    const updatedData = await updateUser(user.id, { first_name: firstName, last_name: lastName });
    setUser(updatedData);
    setIsEditingName(false);
    showSnackbar('Nom mis à jour', 'success');
  };

  return (
    <>
      <InfoSection icon={<Person />} title="Informations personnelles">
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 3, sm: 4 }} textAlign={{ xs: 'center' }}>
            <Box position="relative" display="inline-block" mb={2}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.05)' },
                }}
                src={user?.profile_picture ? `http://localhost:8000${user.profile_picture}` : "/userProfile.jpg"}
              />
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                  backgroundColor: 'white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                  '&:hover': { backgroundColor: '#f0f0f0' },
                }}
              >
                <input
                  type="file"
                  hidden
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  onChange={(e) => handleProfilePictureUpdate(e.target.files[0])}
                />
                <PhotoCameraRounded />
              </IconButton>
            </Box>
            <Typography color='textSecondary' variant='body2' >{user.email}</Typography>
          </Grid>
          <Grid size={{ xs: 12, md: 9, sm: 8 }}>
            <Box display="flex" flexDirection="column" gap={2}>
              {/* <InfoItem iconStart={<EmailRounded />} field="email" /> */}
              <Box display="flex" alignItems="center" gap={2} padding={1} color={'var(--tertiary-color)'} sx={{
                padding: 2,
                borderRadius: 2,
                backgroundColor: 'var(--bg-gray)',
                mb: 1,
              }}>
                <Avatar sx={{ color: 'var(--tertiary-color)' }}>
                  <Person />
                </Avatar>
                {isEditingName ? (
                  <>
                    <TextField
                      label="Prénom"
                      size="small"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      variant="standard"
                      autoFocus
                      fullWidth
                    />
                    <TextField
                      label="Nom"
                      size="small"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      variant="standard"
                      fullWidth
                    />
                    <Box sx={{ display: 'flex', ml: 'auto' }}>
                      <Tooltip title="Enregistrer" arrow placement="top">
                        <IconButton size="small" onClick={handleSaveName}
                          sx={{
                            color: 'white',
                            bgcolor: 'var(--color-primary)',
                            '&:hover': {
                              bgcolor: 'var(--color-primary)',
                              opacity: 0.9,
                            },
                            mr: 1,
                          }}>
                          <Save fontSize='small' />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Annuler" arrow placement="top">
                        <IconButton size="small" onClick={() => setIsEditingName(false)}
                          sx={{
                            color: 'white',
                            bgcolor: 'grey.500',
                            '&:hover': {
                              bgcolor: 'grey.600',
                            },
                          }}>
                          <Close fontSize='small' />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                ) : (
                  <>
                    <Box>{`${user.first_name} ${user.last_name}`}</Box>
                    <IconButton size="small" onClick={() => setIsEditingName(true)}
                      sx={{
                        display: 'flex',
                        ml: 'auto',
                        color: 'var(--color-primary)',
                        border: '1px solid',
                        borderColor: 'var(--color-primary)',
                        '&:hover': {
                          bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
                        },
                      }}>
                      <Edit />
                    </IconButton>
                  </>
                )}
              </Box>
              <InfoItem iconStart={<LocalPhoneRounded />} iconEnd={<Edit />} field="phone_number" labelText={'Téléphone'} />
              <InfoItem iconStart={<HomeRounded />} iconEnd={<Edit />} field="address" labelText={'Adresse'} />
            </Box>
          </Grid>
        </Grid>
      </InfoSection>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

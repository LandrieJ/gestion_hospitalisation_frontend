import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';
import { Avatar, Box, CircularProgress, Grid, IconButton, MenuItem, Paper, TextField, Typography } from '@mui/material';
import { PhotoCameraRounded } from '@mui/icons-material';
import { InputEdit } from '../inputs/InputEdit';
import { updateUser, apiTogetAll } from '../../utils/ApiServices';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHandleTitle } from '../../utils/handleTitle';


const fields = [
  { key: "last_name", label: "Nom", id: "Nom" },
  { key: "first_name", label: "Prénom", id: "Prenom" },
  { key: "email", label: "Email", id: "Email" },
  { key: "phone_number", label: "Numéro de téléphone", id: "Phone" },
  { key: "address", label: "Adresse", id: "Adresse" },
  { key: "fonction", label: "Fonction", id: "Fonction" },
  { key: "matricule_professionnel", label: "Matricule professionnel", id: "Matricule" },
];

export const Compte = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // const [user, setUser] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const roles = { super_admin: "Super Admin", admin: "Admin", simple_user: "Utilisateur Simple" };
  const rolesSelect = [
    { value: "super_admin", label: "Super Admin" },
    { value: "admin", label: "Admin" },
    { value: "simple_user", label: "Utilisateur Simple" }
  ];
  useHandleTitle()
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const hospitalDatas = await apiTogetAll('comptes/hospitals/');
        setHospitals(hospitalDatas);
      } catch {
        setError("Erreur lors du chargement des données.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleFieldUpdate = async (field, newValue) => {
    try {
      await updateUser(user.id, { [field]: newValue });
      // setUser({ ...user, [field]: newValue });
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleProfilePictureUpdate = async (file) => {
    try {
      await updateUser(user.id, {}, file);
      // setUser({ ...user, profile_picture: response.profile_picture });
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la photo de profil:", error);
    }
  };
  return (
    <>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress className={'primary-text-color'} />
        </Box>
      )}
      {error && <Typography color="error">{error}</Typography>}
      {!loading && !error && (
        <Grid container spacing={2} size={12}>
          <Grid container spacing={2} size={{ xs: 12, md: 3 }}>
            <Paper sx={{ display: 'flex', width: '100%', flexDirection: 'column', p: 3, alignItems: 'center', borderRadius: 2, boxShadow: 3, textAlign: 'center', bgcolor: '#ffffff' }}>
              <Box position="relative" display="inline-block">
                <Avatar sx={{ height: 140, width: 140, mb: 2, boxShadow: 2 }} src={user.profile_picture ? `http://localhost:8000${user.profile_picture}` : "/userProfile.jpg"} />
                <IconButton
                  sx={{ position: "absolute", bottom: 0, right: 0, bgcolor: "white" }}
                  component="label"
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
              <Typography fontWeight={'bold'} fontSize={18}>{user.last_name} {user.first_name}</Typography>
              <Typography color="textSecondary" sx={{ fontSize: 14 }}>
                {roles[user.user_type] || "Inconnu"}
              </Typography>
            </Paper>
          </Grid>
          <Grid size={{ xs: 12, md: 9 }}>
            <Paper sx={{ flexGrow: 1, borderRadius: 2, boxShadow: 3, padding: 3 }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Grid container size={12} spacing={1}>
                  {fields.map(({ key, label, id }) => (
                    <Grid mb={1} key={id} size={{ xs: 12, md: 6 }}>
                      <InputEdit

                        id={id}
                        label={label}
                        value={user[key] || ""}
                        onUpdate={(newValue) => handleFieldUpdate(key, newValue)}
                      />
                    </Grid>
                  ))}
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      select
                      label="Hôpital"
                      name="hospital"
                      fullWidth
                      value={user.hospital ? user.hospital.id : ""}
                      onChange={async (e) => {
                        const selectedHospital = hospitals.find((h) => h.id === parseInt(e.target.value));
                        await handleFieldUpdate("hospital", selectedHospital.id);
                      }}
                    >
                      {hospitals.map((hospital) => (
                        <MenuItem key={hospital.id} value={hospital.id}>
                          {hospital.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField select label="Rôle" name="user_type" value={user.user_type || ''} fullWidth
                      onChange={async (e) => {
                        await handleFieldUpdate("user_type", e.target.value);
                      }}>
                      {rolesSelect.map((role) => (
                        <MenuItem key={role.value} value={role.value}>{role.label}</MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  )
}

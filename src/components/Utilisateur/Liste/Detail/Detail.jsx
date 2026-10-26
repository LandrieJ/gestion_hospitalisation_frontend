import {
  alpha,
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme
} from '@mui/material';

// Icons
import {
  AccessTime,
  Badge,
  CalendarMonth,
  Call,
  Email,
  EmojiEvents,
  Favorite,
  LocalHospital,
  LocationOn,
  MedicalInformation,
  MenuBook,
  Person,
  PersonOff,
  School,
  Star,
  WorkspacePremium
} from '@mui/icons-material';
import { apiTogetById, updateUser } from "../../../../utils/ApiServices";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { grey } from '@mui/material/colors';

const formatDate = (dateString) => {
  if (!dateString) return "Non renseigné";
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', { day: "numeric", month: "long", year: "numeric" }) + " à " + date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

// Composant de section
const InfoSection = ({ title, children, icon }) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: 'background.paper'
        }}
      >
        <Box sx={{
          mr: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 32,
          height: 32,
          borderRadius: '50%',
          backgroundColor: 'var(--color-accent-dark)',
          color: 'whitesmoke'
        }}>
          {icon}
        </Box>
        <Typography variant="h6" fontWeight="medium">
          {title}
        </Typography>
      </Box>
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </Card>
  );
};

// Composant principal
export const Detail = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const navigate = useNavigate()

  const handleBlock = (userId) => {
    updateUser(userId, { status: "blocked", is_active: false, });
    navigate('/utilisateur')

  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = await apiTogetById('comptes/users/', id);
        setUser(userData);
      } catch (err) {
        setError("Erreur lors du chargement des données.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fonction pour afficher les étoiles de compétence
  const renderSkillLevel = (level) => (
    [...Array(5)].map((_, index) => (
      <Star key={index}
        sx={{
          fontSize: 16,
          color: index < level ? 'var(--color-primary)' : theme.palette.grey[300]
        }}
      />
    ))
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <CircularProgress sx={{ color: 'var(--color-primary)' }} />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error" sx={{ p: 4 }}>{error}</Typography>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
      }}
    >
      <Container maxWidth="xl">
        {/* Entête du profil */}
        <Paper
          elevation={1}
          sx={{
            mb: 3,
            borderRadius: 3,
            overflow: 'hidden'
          }}
        >
          <Box
          className='bg-color-accent'
            sx={{
              p: 3,
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'center' : 'flex-start',
              gap: 3
            }}
          >
            <Avatar
              src={user.profile_picture ? `http://localhost:8000${user.profile_picture}` : "/userProfile.jpg"}
              sx={{
                width: 100,
                height: 100,
                border: '4px solid white',
                boxShadow: theme.shadows[3]
              }}
            />

            <Box sx={{
              flexGrow: 1,
              textAlign: isMobile ? 'center' : 'left'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                <Typography variant="h4" fontWeight="bold">
                  {`${user.first_name || ''} ${user.last_name || ''}`}
                </Typography>
                {/* <VerifiedUser sx={{ color: theme.palette.common.white }} /> */}
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, justifyContent: isMobile ? 'center' : 'flex-start' }}>
                {user.fonction && (
                  <Chip
                    icon={<LocalHospital color='white' />}
                    label={user.fonction}
                    sx={{
                      bgcolor: 'var(--color-primary-light)',
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                )}
                {user.service && (
                  <Chip
                    color='white'
                    icon={<Badge />}
                    label={user.service.name}
                    sx={{
                      bgcolor: grey[500],
                      color: 'white',
                      fontWeight: 'medium'
                    }}
                  />
                )}
                <Tooltip title='Bloquer ce compte'>
                  <IconButton onClick={() => handleBlock(user.id)} color='error' sx={{ ml: 'auto', borderRadius: 5, bgcolor: alpha('#dc3545', 0.1) }}>
                    <PersonOff fontSize='medium' />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>

          {/* Statistiques rapides */}
          <Box sx={{
            display: 'flex',
            flexDirection: isMobile ? 'column' : 'row',
            flexWrap: 'wrap',
            p: 0
          }}>
            <Box sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
              borderBottom: isMobile ? `1px solid ${theme.palette.divider}` : 'none'
            }}>
              <Typography variant="h5" color="#000" fontWeight="bold">
                {user.patients_registered?.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Patients enregistrés
              </Typography>
            </Box>

            <Box sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              borderRight: isMobile ? 'none' : `1px solid ${theme.palette.divider}`,
              borderBottom: isMobile ? `1px solid ${theme.palette.divider}` : 'none'
            }}>
              <Typography variant="h5" color="#000" fontWeight="bold">
                {user.statistiques?.experience || 0} ans
              </Typography>
              <Typography variant="body2" color="text.secondary">
                D'expérience
              </Typography>
            </Box>

            <Box sx={{
              flex: 1,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Typography variant="h5" color="#000" fontWeight="bold">
                {user.statistiques?.consultations || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Consultations
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* Contenu principal */}
        <Grid container spacing={3}>
          {/* Colonne de gauche */}
          <Grid size={{xs:12, md:4}}>
            <InfoSection title="Informations de contact" icon={<Person />}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Email color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">
                      {user.email || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Call color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Téléphone
                    </Typography>
                    <Typography variant="body1">
                      {user.phone_number || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocationOn color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Adresse
                    </Typography>
                    <Typography variant="body1">
                      {user.address || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>

                <Divider />
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <LocalHospital color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Hôpital
                    </Typography>
                    <Typography variant="body1">
                      {user.hospital?.name || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>
                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <CalendarMonth color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Date de création du compte
                    </Typography>
                    <Typography variant="body1">
                      {formatDate(user.date_joined) || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>

                <Divider />

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                  <Badge color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      Numéro matricule
                    </Typography>
                    <Typography variant="body1">
                      {user.matricule_professionnel || 'Non disponible'}
                    </Typography>
                  </Box>
                </Box>
              </Stack>
            </InfoSection>

            <InfoSection title="Horaires de travail" icon={<AccessTime />}>
              {user.horaires ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body1" fontWeight="medium">
                      {`De ${user.horaires.debut.slice(0, 5)} à ${user.horaires.fin.slice(0, 5)}`}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {user.horaires.jours?.length > 0 ? (
                      user.horaires.jours.map((jour, index) => (
                        <Chip
                          key={index}
                          label={jour}
                          sx={{ color: 'var(--color-primary)' }}
                          variant="outlined"
                          size="small"
                        />
                      ))
                    ) : (
                      <Typography variant="body2" color="text.secondary">Aucun jour spécifié</Typography>
                    )}
                  </Stack>
                </>
              ) : (
                <Typography variant="body2" color="text.secondary">Horaires non spécifiés</Typography>
              )}
            </InfoSection>
          </Grid>

          {/* Colonne de droite */}
          <Grid size={{xs:12, md:8}}>
            <InfoSection title="Biographie" icon={<MenuBook />}>
              <Typography variant="body1">
                {user.biographie || 'Aucune biographie disponible.'}
              </Typography>
            </InfoSection>

            <InfoSection title="Spécialités" icon={<MedicalInformation />}>
              <Grid container spacing={2}>
                {user.specialites?.length > 0 ? (
                  user.specialites.map((value, index) => (
                    <Grid size={{xs:12, sm:6, md:4}} key={index}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 2,
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          border: `1px solid var(--color-primary)`,
                          borderRadius: 2,
                        }}
                      >
                        <Favorite

                          sx={{ mr: 1.5, fontSize: 20, color: 'var(--color-primary)' }}
                        />
                        <Typography variant="body1" fontWeight="medium">
                          {value.specialite}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))
                ) : (
                  <Grid xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      Aucune spécialité disponible.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </InfoSection>

            <Grid container spacing={3}>
              <Grid size={{xs:12, md:6}}>
                <InfoSection title="Formation" icon={<School />}>
                  <Stack spacing={2.5}>
                    {user.education?.length > 0 ? (
                      user.education.map((edu, index) => (
                        <Box key={index}>
                          <Typography variant="body1" fontWeight="medium">
                            {edu.diplome}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {edu.etablissement}, {edu.annee}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        Aucune information de formation disponible.
                      </Typography>
                    )}
                  </Stack>
                </InfoSection>
              </Grid>

              <Grid size={{xs:12, md:6}}>
                <InfoSection title="Certifications" icon={<WorkspacePremium />}>
                  <Stack spacing={2}>
                    {user.certifications?.length > 0 ? (
                      user.certifications.map((cert, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 1.5
                          }}
                        >
                          <EmojiEvents
                            sx={{ fontSize: 20, color: 'var(--color-primary)' }}
                          />
                          <Typography variant="body1">
                            {cert.certification}
                          </Typography>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        Aucune certification disponible.
                      </Typography>
                    )}
                  </Stack>
                </InfoSection>
              </Grid>
            </Grid>

            <InfoSection title="Compétences" icon={<Star />}>
              <Grid container spacing={2}>
                {user.competences?.length > 0 ? (
                  user.competences.map((competence, index) => (
                    <Grid size={{xs:12, sm:6}} key={index}>
                      <Box sx={{ mb: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {competence.nom}
                          </Typography>
                          <Box>
                            {renderSkillLevel(competence.niveau)}
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            width: '100%',
                            height: 6,
                            bgcolor: theme.palette.grey[200],
                            borderRadius: 5,
                            overflow: 'hidden'
                          }}
                        >
                          <Box
                            sx={{
                              width: `${(competence.niveau / 5) * 100}%`,
                              height: '100%',
                              bgcolor: 'var(--color-primary)',
                              borderRadius: 5
                            }}
                          />
                        </Box>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Grid xs={12}>
                    <Typography variant="body1" color="text.secondary">
                      Aucune compétence disponible.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </InfoSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};
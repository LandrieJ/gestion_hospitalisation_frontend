import { useContext, useState } from 'react';
import { UserContext } from '../../utils/UserContext';
import { InfoSection } from './SectionComponent';
import {
  Add,
  Edit,
  Save,
  Close,
  Star,
  DeleteRounded,
  StarBorder
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Tooltip,
  Typography,
  useTheme,
  Grid,
  TextField,
  Slider,
  Button,
  Paper,
  Avatar,
  Fade,
  Card,
  Divider,
  Rating
} from '@mui/material';
import { updateUserResource, addUserResource, deleteUserResource } from '../../utils/ApiServices';

const renderSkillLevel = (level, theme) => (
  <Rating
    name="read-only"
    value={level}
    readOnly
    precision={1}
    icon={<Star sx={{ fontSize: 18, color: 'var(--color-primary)' }} />}
    emptyIcon={<StarBorder sx={{ fontSize: 18, color: theme.palette.grey[400] }} />}
  />
);

const InfoItem = ({ competence, editingField, setEditingField, updateCompetence, onDelete, theme }) => {
  const isEditing = editingField === competence.id;
  const [editValue, setEditValue] = useState({ ...competence });
  const [isHovered, setIsHovered] = useState(false);

  const handleEditStart = () => setEditingField(competence.id);

  const handleEditSave = async () => {
    if (!editValue.nom.trim()) return;
    await updateCompetence(competence.id, editValue);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditValue({ ...competence });
    setEditingField(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
      <Paper
        elevation={2}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          mb: 2,
          p: 2.5,
          borderRadius: 2,
          backgroundColor: 'var(--bg-gray)',
          border: '1px solid',
          borderColor: 'var(--bg-gray)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {isEditing ? (
          <Fade in={isEditing}>
            <Box sx={{ position: 'relative' }}>
              <TextField
                label="Nom de la compétence"
                value={editValue.nom}
                onChange={(e) => setEditValue({ ...editValue, nom: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                autoFocus
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <Typography variant="body2" sx={{ mt: 1, mb: 0.5, fontWeight: 'medium' }}>Niveau</Typography>
              <Box sx={{ px: 1 }}>
                <Slider
                  value={editValue.niveau}
                  onChange={(e, newValue) => setEditValue({ ...editValue, niveau: newValue })}
                  step={1}
                  min={1}
                  max={5}
                  marks
                  valueLabelDisplay="auto"
                  sx={{
                    '& .MuiSlider-rail': { bgcolor: theme.palette.grey[300] },
                    '& .MuiSlider-track': { bgcolor: 'var(--color-primary)' },
                    '& .MuiSlider-thumb': {
                      bgcolor: 'white',
                      border: '2px solid var(--color-primary)',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: '0 0 0 8px rgba(var(--color-primary-rgb), 0.16)'
                      }
                    },
                    '& .MuiSlider-valueLabel': {
                      bgcolor: 'var(--color-primary)'
                    }
                  }}
                />
              </Box>
              <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: 'flex-end' }}>
                <Tooltip title="Enregistrer" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleEditSave}
                    sx={{
                      color: 'white',
                      bgcolor: 'var(--color-primary)',
                      '&:hover': {
                        bgcolor: 'var(--color-primary)',
                        opacity: 0.9,
                      },
                    }}
                  >
                    <Save fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Annuler" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleCancelEdit}
                    sx={{
                      color: 'white',
                      bgcolor: 'grey.500',
                      '&:hover': {
                        bgcolor: 'grey.600',
                      },
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Fade>
        ) : (
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                sx={{
                  color: 'var(--tertiary-color)',
                  width: 40,
                  height: 40,
                }}
              >
                <Star />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="medium">{competence.nom}</Typography>
                <Box sx={{ mt: 0.5 }}>{renderSkillLevel(competence.niveau, theme)}</Box>
              </Box>
            </Box>
            <Fade in={true}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Modifier" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={handleEditStart}
                    sx={{
                      color: 'var(--color-primary)',
                      border: '1px solid',
                      borderColor: 'var(--color-primary)',
                      '&:hover': {
                        bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
                      },
                    }}
                  >
                    <Edit fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Supprimer" arrow placement="top">
                  <IconButton
                    size="small"
                    onClick={() => onDelete(competence.id)}
                    sx={{
                      color: '#d32f2f',
                      border: '1px solid #d32f2f',
                      '&:hover': {
                        bgcolor: 'rgba(211, 47, 47, 0.1)',
                      },
                    }}
                  >
                    <DeleteRounded fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Fade>
          </Box>
        )}
      </Paper>
    </Grid>
  );
};

export const Specialites = () => {
  const { user, setUser } = useContext(UserContext);
  const theme = useTheme();
  const [editingField, setEditingField] = useState(null);
  const [competencesList, setCompetencesList] = useState(user.competences || []);
  const [newCompetence, setNewCompetence] = useState({ nom: '', niveau: 3 });
  const [isAdding, setIsAdding] = useState(false);

  const updateCompetence = async (id, updatedCompetence) => {
    try {
      const response = await updateUserResource('competence', user.id, id, updatedCompetence);
      if (response) {
        const updatedList = competencesList.map((comp) => (comp.id === id ? response : comp));
        setCompetencesList(updatedList);
        setUser((prevUser) => ({ ...prevUser, competences: updatedList }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la compétence:", error);
    }
  };

  const addCompetence = async () => {
    if (!newCompetence.nom.trim()) return;

    try {
      const response = await addUserResource('competence', user.id, newCompetence);
      if (response) {
        const updatedList = [...competencesList, response];
        setCompetencesList(updatedList);
        setUser((prevUser) => ({ ...prevUser, competences: updatedList }));
      }
      setNewCompetence({ nom: '', niveau: 3 });
      setIsAdding(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de la compétence:", error);
    }
  };

  const deleteCompetence = async (id) => {
    try {
      await deleteUserResource('competence', user.id, id)

      const updatedList = competencesList.filter((comp) => comp.id !== id);
      setCompetencesList(updatedList);
      setUser((prevUser) => ({ ...prevUser, competences: updatedList }));
    } catch (error) {
      console.error("Erreur lors de la suppression de la compétence:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addCompetence();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewCompetence({ nom: '', niveau: 3 });
    }
  };

  return (
    <InfoSection
      icon={<Star />}
      title="Spécialités et compétences"
      buttonSuplements={
        <Tooltip title="Ajouter une compétence" arrow placement="left">
          <IconButton
            sx={{
              bgcolor: "var(--color-secondary)",
              color: "white",
              transition: "transform 0.2s",
              "&:hover": {
                bgcolor: "var(--color-secondary)",
                opacity: 0.9,
                transform: "scale(1.1)"
              }
            }}
            size="small"
            onClick={() => setIsAdding(true)}
          >
            <Add />
          </IconButton>
        </Tooltip>
      }
    >
      <Grid container spacing={2}>
        {isAdding && (
          <Grid size={{ xs: 12 }}>
            <Card
              elevation={3}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: "var(--bg-gray)",
                borderLeft: '4px solid var(--color-primary)',
                mb: 2
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'var(--color-primary)' }}>
                Nouvelle compétence
              </Typography>
              <TextField
                label="Nom de la compétence"
                value={newCompetence.nom}
                onChange={(e) => setNewCompetence({ ...newCompetence, nom: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                autoFocus
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <Box>
                <Typography variant="body2" sx={{ mt: 1, mb: 0.5, fontWeight: 'medium' }}>Niveau</Typography>
                <Box sx={{ px: 1, mb: 2 }}>
                  <Slider
                    value={newCompetence.niveau}
                    onChange={(e, newValue) => setNewCompetence({ ...newCompetence, niveau: newValue })}
                    step={1}
                    min={1}
                    max={5}
                    marks
                    valueLabelDisplay="auto"
                    sx={{
                      '& .MuiSlider-rail': { bgcolor: theme.palette.grey[300] },
                      '& .MuiSlider-track': { bgcolor: 'var(--color-primary)' },
                      '& .MuiSlider-thumb': {
                        bgcolor: 'white',
                        border: '2px solid var(--color-primary)',
                        '&:hover, &.Mui-focusVisible': {
                          boxShadow: '0 0 0 8px rgba(var(--color-primary-rgb), 0.16)'
                        }
                      },
                      '& .MuiSlider-valueLabel': {
                        bgcolor: 'var(--color-primary)'
                      }
                    }}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                  <Rating
                    name="skill-level-preview"
                    value={newCompetence.niveau}
                    readOnly
                    precision={1}
                    icon={<Star sx={{ fontSize: 28, color: 'var(--color-primary)' }} />}
                    emptyIcon={<StarBorder sx={{ fontSize: 28, color: theme.palette.grey[400] }} />}
                  />
                </Box>
              </Box>
              <Box sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={addCompetence}
                  sx={{
                    bgcolor: "var(--color-primary)",
                    "&:hover": {
                      bgcolor: "var(--color-primary)",
                      opacity: 0.9
                    }
                  }}
                >
                  Ajouter
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => setIsAdding(false)}
                  sx={{
                    color: "grey.600",
                    borderColor: "grey.400",
                    "&:hover": {
                      borderColor: "grey.600",
                      bgcolor: "transparent"
                    }
                  }}
                >
                  Annuler
                </Button>
              </Box>
            </Card>
          </Grid>
        )}
        {competencesList.length > 0 ? (
          competencesList.map((competence) => (
            <InfoItem
              key={competence.id}
              competence={competence}
              editingField={editingField}
              setEditingField={setEditingField}
              updateCompetence={updateCompetence}
              onDelete={deleteCompetence}
              theme={theme}
            />
          ))
        ) : (
          <Grid size={{ xs: 12 }}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                bgcolor: 'var(--bg-gray)',
                border: '1px dashed',
                borderColor: 'grey.400',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Star sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" align="center">
                Aucune compétence disponible.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setIsAdding(true)}
                className='text-color-primary'
                sx={{ mt: 2}}
              >
                Ajouter une compétence
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </InfoSection>
  );
};
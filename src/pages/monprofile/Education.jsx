import { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Button,
  Paper,
  Avatar,
  Fade,
  Card,
} from "@mui/material";
import { InfoSection } from "./SectionComponent";
import { Edit, Save, Close, SchoolRounded, Add, DeleteRounded, School } from "@mui/icons-material";
import { UserContext } from "../../utils/UserContext";
import { updateUserResource, deleteUserResource, addUserResource } from "../../utils/ApiServices";

const EducationItem = ({ education, editingField, setEditingField, updateEducation, onDelete }) => {
  const isEditing = editingField === education.id;
  const [editValue, setEditValue] = useState({ ...education });
  const [yearError, setYearError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleEditStart = () => setEditingField(education.id);

  const handleEditSave = async () => {
    const yearPattern = /^\d{4}$/;
    if (!editValue.diplome.trim() || !editValue.etablissement.trim() || !yearPattern.test(editValue.annee)) {
      setYearError(!yearPattern.test(editValue.annee));
      return;
    }

    await updateEducation(education.id, editValue);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditValue({ ...education });
    setEditingField(null);
    setYearError(false);
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
          transition: "all 0.3s ease",
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
                label="Diplôme"
                value={editValue.diplome}
                onChange={(e) => setEditValue({ ...editValue, diplome: e.target.value })}
                fullWidth
                variant="outlined"
                autoFocus
                size="small"
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Établissement"
                value={editValue.etablissement}
                onChange={(e) => setEditValue({ ...editValue, etablissement: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Année"
                value={editValue.annee}
                onChange={(e) => {
                  setEditValue({ ...editValue, annee: e.target.value });
                  setYearError(false);
                }}
                fullWidth
                variant="outlined"
                size="small"
                error={yearError}
                helpertext={yearError ? "Format attendu: YYYY" : ""}
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
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
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <Avatar
                sx={{
                  color: 'var(--tertiary-color)',
                  width: 40,
                  height: 40,
                }}
              >
                <School />
              </Avatar>
              <Box>
                <Typography variant="h6" fontWeight="medium">{education.diplome}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {education.etablissement}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  Promotion {education.annee}
                </Typography>
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
                    onClick={() => onDelete(education.id)}
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

export const Education = () => {
  const { user, setUser } = useContext(UserContext);
  const [editingField, setEditingField] = useState(null);
  const [educationList, setEducationList] = useState(user.education || []);
  const [newEducation, setNewEducation] = useState({ diplome: "", etablissement: "", annee: "" });
  const [isAdding, setIsAdding] = useState(false);

  const updateEducation = async (id, updatedEducation) => {
    try {
      const response = await updateUserResource('education', user.id, id, updatedEducation);
      if (response) {
        const updatedList = educationList.map((edu) => (edu.id === id ? response : edu));
        setEducationList(updatedList);
        setUser((prevUser) => ({ ...prevUser, education: updatedList }));
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'éducation:", error);
    }
  };

  const addEducation = async () => {
    if (!newEducation.diplome.trim() || !newEducation.etablissement.trim() || !/^\d{4}$/.test(newEducation.annee)) {
      return;
    }

    try {
      const response = await addUserResource('education', user.id, newEducation);
      if (response) {
        const updatedList = [...educationList, response];
        setEducationList(updatedList);
        setUser((prevUser) => ({ ...prevUser, education: updatedList }));
      }

      setNewEducation({ diplome: "", etablissement: "", annee: "" });
      setIsAdding(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'éducation:", error);
    }
  };

  const deleteEducation = async (id) => {
    try {
      await deleteUserResource('education', user.id, id);


      const updatedList = educationList.filter((edu) => edu.id !== id);
      setEducationList(updatedList);
      setUser((prevUser) => ({ ...prevUser, education: updatedList }));
    } catch (error) {
      console.error("Erreur lors de la suppression de l'éducation:", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addEducation();
    } else if (e.key === 'Escape') {
      setIsAdding(false);
      setNewEducation({ diplome: "", etablissement: "", annee: "" });
    }
  };

  return (
    <InfoSection
      icon={<SchoolRounded />}
      title="Éducation et certifications"
      buttonSuplements={
        <Tooltip title="Ajouter une formation" arrow placement="left">
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
                Nouvelle formation
              </Typography>
              <TextField
                label="Diplôme"
                value={newEducation.diplome}
                onChange={(e) => setNewEducation({ ...newEducation, diplome: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                autoFocus
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Établissement"
                value={newEducation.etablissement}
                onChange={(e) => setNewEducation({ ...newEducation, etablissement: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                onKeyDown={handleKeyDown}
                sx={{ mb: 2 }}
              />
              <TextField
                label="Année"
                value={newEducation.annee}
                onChange={(e) => setNewEducation({ ...newEducation, annee: e.target.value })}
                fullWidth
                variant="outlined"
                size="small"
                onKeyDown={handleKeyDown}
                error={!/^\d{4}$/.test(newEducation.annee) && newEducation.annee !== ""}
                helpertext={!/^\d{4}$/.test(newEducation.annee) && newEducation.annee !== "" ? "Format attendu: YYYY" : ""}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 1, justifyContent: "flex-end" }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={addEducation}
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
        {educationList.length > 0 ? (
          educationList.map((education) => (
            <EducationItem
              key={education.id}
              education={education}
              editingField={editingField}
              setEditingField={setEditingField}
              updateEducation={updateEducation}
              onDelete={deleteEducation}
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
              <SchoolRounded sx={{ fontSize: 48, color: 'grey.400', mb: 2 }} />
              <Typography variant="body1" color="text.secondary" align="center">
                Aucune formation enregistrée.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<Add />}
                onClick={() => setIsAdding(true)}
                sx={{ mt: 2, borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
              >
                Ajouter une formation
              </Button>
            </Paper>
          </Grid>
        )}
      </Grid>
    </InfoSection>
  );
};
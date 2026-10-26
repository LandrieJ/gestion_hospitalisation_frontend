import { useContext, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  IconButton,
  TextField,
  Tooltip,
  Select,
  MenuItem,
  Chip,
} from "@mui/material";
import { Edit, Save, Close, Schedule } from "@mui/icons-material";
import { UserContext } from "../../utils/UserContext";
import { InfoSection } from "./SectionComponent";
import { grey } from "@mui/material/colors";
import { updateUserHoraires } from "../../utils/ApiServices";

export const HoraireTravail = () => {
  const { user, setUser } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  // Valeurs par défaut au cas où elles ne sont pas définies
  const defaultHoraire = {
    debut: "00:00:00",
    fin: "00:00:00",
    jours: ["Lundi", "Mardi", "Mercredi"],
  };

  const initialHoraire = user.horaires || defaultHoraire;
  const [editValue, setEditValue] = useState({ ...initialHoraire });

  const handleEditSave = async () => {
    if (!editValue.debut || !editValue.fin || editValue.jours.length === 0) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formattedData = {
      ...editValue,
      jours: editValue.jours.map((j) => (typeof j === "string" ? j : j.jour)),
    };

    try {
      const updated = await updateUserHoraires(user.id, formattedData);
      setUser((prevUser) => ({
        ...prevUser,
        horaires: updated,
      }));

      setEditing(false);
    } catch {
      alert("Erreur lors de la mise à jour des horaires. Veuillez réessayer.");
    }
  };


  return (
    <Grid size={{xs:12, md:8, lg:6}}>
      <InfoSection
        icon={<Schedule />}
        title="Horaires de travail"
        buttonSuplements={
          <EditButton
            isEditing={editing}
            onEdit={() => setEditing(true)}
            onSave={handleEditSave}
            onCancel={() => setEditing(false)}
            editValue={editValue}
          />
        }
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <ScheduleItem isEditing={editing} editValue={editValue} setEditValue={setEditValue} />
        </Box>
      </InfoSection>
    </Grid>
  );
};

const ScheduleItem = ({ isEditing, editValue, setEditValue }) => {
  const availableDays = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"];

  return (
    <Box display="flex" flexDirection="column" gap={2} sx={{ padding: 1, borderRadius: 2 }}>
      {isEditing ? (
        <>
          <TextField
            label="Heure de début"
            type="time"
            value={editValue.debut.slice(0, 5)}
            onChange={(e) => setEditValue({ ...editValue, debut: e.target.value + ":00" })}
            fullWidth
            variant="standard"
          />
          <TextField
            label="Heure de fin"
            type="time"
            value={editValue.fin.slice(0, 5)}
            onChange={(e) => setEditValue({ ...editValue, fin: e.target.value + ":00" })}
            fullWidth
            variant="standard"
          />
          <Select
            multiple
            value={editValue.jours}
            onChange={(e) => setEditValue({ ...editValue, jours: e.target.value })}
            fullWidth
            variant="standard"
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} sx={{ backgroundColor: grey[200], color: "black", fontWeight: "bold" }} />
                ))}
              </Box>
            )}
          >
            {availableDays.map((day) => (
              <MenuItem key={day} value={day}>
                {day}
              </MenuItem>
            ))}
          </Select>
        </>
      ) : (
        <Box sx={{ padding: 2, borderRadius: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
          <Typography fontSize={'small'} color="textSecondary">Heure de début</Typography>
          {editValue.debut.slice(0, 5)}
          <Typography fontSize={'small'} color="textSecondary">Heure de fin</Typography>
          {editValue.fin.slice(0, 5)}
          <Typography fontSize={'small'} color="textSecondary">Jours :</Typography>
          <Box>
            {editValue.jours.map((jour, index) => (
              <Chip key={index} label={jour} sx={{ backgroundColor: grey[200], color: "black", fontWeight: "bold" }} />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
};

const EditButton = ({ isEditing, onEdit, onSave, onCancel }) => {
  return isEditing ? (
    <Box sx={{ display: 'flex', ml: 'auto' }}>
      <Tooltip title="Enregistrer" arrow placement="bottom">
        <IconButton size="small" onClick={onSave}
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
      <Tooltip title="Annuler" arrow placement="bottom">
        <IconButton size="small" onClick={onCancel}
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
  ) : (
    <Tooltip title="Modifier" arrow placement="bottom">
      <IconButton
        size="small"
        onClick={onEdit}
        sx={{
          color: 'var(--color-primary)',
          border: '1px solid',
          borderColor: 'var(--color-primary)',
          '&:hover': {
            bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
          },
        }}
      >
        <Edit />
      </IconButton>
    </Tooltip>
  );
};

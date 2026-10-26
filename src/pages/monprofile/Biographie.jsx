import { useContext, useState } from 'react';
import { Edit, Save, Close, MenuBook } from '@mui/icons-material';
import { Box, IconButton, Typography, TextareaAutosize, Tooltip, Grid } from '@mui/material';
import { UserContext } from '../../utils/UserContext';
import { InfoSection } from './SectionComponent';
import { updateUser } from '../../utils/ApiServices';
export const Biographie = () => {
  const { user, setUser } = useContext(UserContext);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState(user?.biographie || '');  // initialisation de la valeur du texte
  const isEditing = editingField === "biographie";

  const handleEditStart = () => {
    setEditingField("biographie");
    setEditValue(user?.biographie || '');  // Charger la biographie actuelle
  };

  const handleEditSave = async () => {
    if (editValue.trim() === '') {
      alert('Le champ ne peut pas être vide');
      return;
    }

    const updatedUser = await updateUser(user.id, { biographie: editValue });

    setUser(updatedUser);
    setEditingField(null);
  };

  return (
    <Grid size={{xs:12, md:8, lg:6}}>
      <InfoSection
        icon={<MenuBook />}
        title="Biographie"
        buttonSuplements={<EditButton isEditing={isEditing} onEdit={handleEditStart} onSave={handleEditSave} onCancel={() => setEditingField(null)} />}
      >
        <Box display="flex" flexDirection="column" gap={2}>
          <InfoItem isEditing={isEditing} editValue={editValue} setEditValue={setEditValue} />
        </Box>
      </InfoSection>
    </Grid>
  );
};

const InfoItem = ({ isEditing, editValue, setEditValue }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      sx={{
        padding: 1,
        borderRadius: 2,
        transition: 'background-color 0.3s',
        '&:hover': { backgroundColor: 'var(--bg-gray)' },
      }}
    >
      <Box display="flex" alignItems="center" gap={2} flexGrow={1} color={'var(--tertiary-color)'}>
        {isEditing ? (
          <TextareaAutosize
            minRows={3}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
            style={{ width: '100%' }}
          />
        ) : (
          <Typography variant="body1" color="text.secondary">{editValue || 'Aucune biographie renseignée'}</Typography>
        )}
      </Box>
    </Box>
  );
};

const EditButton = ({ isEditing, onEdit, onSave, onCancel }) => {
  return (
    <>
      {isEditing ? (
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
      )}
    </>
  );
};

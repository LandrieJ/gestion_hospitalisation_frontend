import { useState } from 'react';
import {
  Save,
  Close,
  MoreVert,
  DeleteRounded,
} from '@mui/icons-material';
import {
  Box,
  IconButton,
  Typography,
  CardContent,
  Card,
  TextField,
  Tooltip,
  Paper,
  Avatar,
  Fade,
  Divider,
} from '@mui/material';
import { useTheme } from '@mui/system';
import { updateUser } from '../../utils/ApiServices';
import { useContext } from 'react';
import { UserContext } from '../../utils/UserContext';

export const InfoItem = ({ iconStart, iconEnd, labelText = '', field, FieldType = TextField }) => {
  const { user, setUser } = useContext(UserContext);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();
  const isEditing = editingField === field;

  const handleEditStart = (field, currentValue) => {
    setEditingField(field);
    setEditValue(currentValue);
  };

  const handleEditSave = async () => {
    if (editValue.trim() === '') return;

    try {
      const updatedUser = await updateUser(user.id, { [field]: editValue });
      setUser((prevUser) => ({ ...prevUser, [field]: editValue }));
      setEditingField(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleEditSave();
    } else if (e.key === 'Escape') {
      setEditingField(null);
    }
  };

  return (
    <Paper
      elevation={1}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        padding: 2,
        borderRadius: 2,
        backgroundColor: 'var(--bg-gray)',
        mb: 1,
      }}
    >
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box display="flex" alignItems="center" gap={2} flexGrow={1}>
          <Avatar
            sx={{ color: 'var(--tertiary-color)' }}
          >
            {iconStart}
          </Avatar>
          {isEditing ? (
            <Fade in={isEditing}>
              <Box sx={{ width: '100%' }}>
                <FieldType
                  label={labelText}
                  size="small"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  variant="standard"
                  autoFocus
                  fullWidth
                />
              </Box>
            </Fade>
          ) : (
            <Box display="flex" flexDirection="column" sx={{ width: '100%' }}>
              <Typography color="textSecondary" variant="caption" fontWeight="medium">
                {labelText}
              </Typography>
              <Typography variant="body1" fontWeight="medium">
                {user[field] || '–'}
              </Typography>
            </Box>
          )}
        </Box>
        {isEditing ? (
          <Box>
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
                  mr: 1,
                }}
              >
                <Save fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Annuler" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => setEditingField(null)}
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
        ) : (
          iconEnd && (<Fade in={true}>
            <Tooltip title="Modifier" arrow placement="top">
              <IconButton
                size="small"
                onClick={() => handleEditStart(field, user[field])}
                sx={{
                  color: 'var(--color-primary)',
                  border: '1px solid',
                  borderColor: 'var(--color-primary)',
                  '&:hover': {
                    bgcolor: 'rgba(var(--color-primary-rgb), 0.1)',
                  },
                }}
              >
                {iconEnd}
              </IconButton>
            </Tooltip>
          </Fade>)
        )}
      </Box>
    </Paper>
  );
};

export const InfoSection = ({ title, children, icon, buttonSuplements }) => {
  const theme = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        mb: 3,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          p: 2,
          bgcolor: isHovered ? 'rgba(var(--color-primary), 0.05)' : 'transparent',
          transition: 'background-color 0.3s ease',
        }}
      >
        <Avatar
          className='bg-color-accent'
          sx={{
            mr: 1.5,
            width: 42,
            height: 42,
          }}
        >
          {icon}
        </Avatar>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: 'inherit',
            transition: 'color 0.3s ease',
          }}
        >
          {title}
        </Typography>
        <Box sx={{ ml: 'auto' }} >
          {buttonSuplements}
        </Box>
      </Box>
      <Divider sx={{ opacity: 0.5 }} />
      <CardContent sx={{ p: 3 }}>
        {children}
      </CardContent>
    </Card>
  );
};
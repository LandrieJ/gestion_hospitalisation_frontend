import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Grid,
  Card,
  CardContent,
  Avatar,
  alpha,
  useTheme,
  TableSortLabel,
  TextField,
  Dialog,
  DialogTitle,
  Tooltip,
  DialogActions,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  OpenInNewRounded,
  People as PeopleIcon
} from '@mui/icons-material';
import { apiToDelete, apiTogetAll, apiToPatch, apiToPost } from '../../../../utils/ApiServices';

const genreColors = {
  homme: 'primary',
  femme: 'secondary'
};

const PatientForm = ({ mode, initialData, onSave, onClose }) => {
  const [formData, setFormData] = useState(
    initialData || {
      first_name: '',
      last_name: '',
      cin_number: '',
      genre: '',
      birth_date: ''
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Nom"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Prénom"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="CIN"
            name="cin_number"
            value={formData.cin_number}
            onChange={handleChange}
            
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormControl fullWidth>
            <InputLabel>Genre</InputLabel>
            <Select
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              label="Genre"
            >
              <MenuItem value="Homme">Homme</MenuItem>
              <MenuItem value="Femme">Femme</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Date de naissance"
            name="birth_date"
            type="date"
            value={formData.birth_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
      </Grid>
      <DialogActions sx={{ mt: 3 }}>
        <Button onClick={onClose}>Annuler</Button>
        <Button type="submit" variant="contained" color="primary">
          {mode === 'create' ? 'Créer' : 'Modifier'}
        </Button>
      </DialogActions>
    </Box>
  );
};


const PatientDetail = ({ patient, genreColors, onClose }) => {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Détails du patient</Typography>
      <Stack spacing={2} sx={{ mt: 2 }}>
        <Box>
          <Typography variant="body2" color="text.secondary">Nom</Typography>
          <Typography variant="body1">{patient.first_name || 'Inconnu'}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Prénom</Typography>
          <Typography variant="body1">{patient.last_name || 'Inconnu'}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">CIN</Typography>
          <Typography variant="body1">{patient.cin_number || 'Inconnu'}</Typography>
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Genre</Typography>
          <Chip
            label={patient.genre || 'Inconnu'}
            color={genreColors[patient.genre]}
            size="small"
            variant="filled"
          />
        </Box>
        <Box>
          <Typography variant="body2" color="text.secondary">Date de naissance</Typography>
          <Typography variant="body1">
            {new Date(patient.birth_date).toLocaleDateString('fr-FR')}
          </Typography>
        </Box>
      </Stack>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Fermer</Button>
      </DialogActions>
    </Box>
  );
};
const getEtat_de_la_personne = (statut) => {
  const etat_de_la_personne = {
    'malade': { label: "Malade", color: "error" },
    'bonnesante': { label: "En bonne santé", color: "success" },
    'mort': { label: "Mort", color: "default" },
  };
  return etat_de_la_personne[statut] || { label: statut || "Non défini", color: "default" };
};

export const Patient = () => {
  const theme = useTheme();
  const [patients, setPatients] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGenre, setFilterGenre] = useState('');
  const [sortBy, setSortBy] = useState('first_name');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSort = (field) => {
    const isAsc = sortBy === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortBy(field);
  };

  const handleOpenDialog = (mode, patient) => {
    setSelectedPatient(patient);
    setDialogMode(mode);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setDialogMode('');
    setSelectedPatient(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSavePatient = async (formData) => {
    if (dialogMode === 'create') {
      const newPatient = {
        ...formData,
        id: `PAT${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${String(patients.length + 1).padStart(3, '0')}`
      };
      await apiToPost('patient/', newPatient);
      setPatients([newPatient, ...patients]);
    } else if (dialogMode === 'edit' && selectedPatient) {
      await apiToPatch('patient/', selectedPatient.id, formData);
      setPatients(patients.map(p => (p.id === selectedPatient.id ? { ...p, ...formData } : p)));
    }
    handleCloseDialog();
  };

  const handleDeletePatient = async () => {
    if (selectedPatient) {
      await apiToDelete('patient/', selectedPatient.id);
      setPatients(patients.filter(p => p.id !== selectedPatient.id));
      handleCloseDialog();
    }
  };

  const filteredPatients = patients
    .filter(patient => {
      const matchesSearch =
        patient.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(patient.cin_number)?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !filterGenre || patient.genre === filterGenre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      if (sortBy === 'birth_date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  useEffect(() => {
    const fetchData = async () => {
      const patientsData = await apiTogetAll('patient/');
      setPatients(patientsData || []);
    };
    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PeopleIcon sx={{ mr: 2, fontSize: 30 }} color="primary" />
            <Typography variant="h6" component="h6" fontWeight="bold">
              Gestion des Patients
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Gestion des informations des patients
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog('create')}
          sx={{ borderRadius: 2 }}
        >
          Nouveau Patient
        </Button>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                <PeopleIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Total Patients
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {patients.length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  En bonne santé
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {patients.filter(p => p.etat_de_la_personne === 'bonnesante').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'error.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Malade
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {patients.filter(p => p.etat_de_la_personne === 'malade').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 12, md: 3 }}>
          <Card>
            <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar sx={{ bgcolor: 'default.main', mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Box>
                <Typography color="textSecondary" variant="body2">
                  Déces
                </Typography>
                <Typography variant="h5" fontWeight="bold">
                  {patients.filter(p => p.etat_de_la_personne === 'mort').length}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Search */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              placeholder="Rechercher un patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel>Genre</InputLabel>
              <Select
                value={filterGenre}
                label="Genre"
                onChange={(e) => setFilterGenre(e.target.value)}
              >
                <MenuItem value="">Tous</MenuItem>
                <MenuItem value="Homme">Homme</MenuItem>
                <MenuItem value="Femme">Femme</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Patients Table */}
      <Paper>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(theme.palette.primary.main, 0.1) }}>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'nom'}
                    direction={sortOrder}
                    onClick={() => handleSort('nom')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Nom</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'birth_date'}
                    direction={sortOrder}
                    onClick={() => handleSort('birth_date')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Age</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'prenom'}
                    direction={sortOrder}
                    onClick={() => handleSort('prenom')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Etat</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'cin'}
                    direction={sortOrder}
                    onClick={() => handleSort('cin')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">CIN</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={sortBy === 'genre'}
                    direction={sortOrder}
                    onClick={() => handleSort('genre')}
                  >
                    <Typography variant="subtitle2" fontWeight="bold">Genre</Typography>
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight="bold">Actions</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">{patient.last_name || 'Inconnu'} {patient.first_name || 'Inconnu'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {new Date().getFullYear() - new Date(patient.birth_date).getFullYear()} ans
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                          label={getEtat_de_la_personne(patient.etat_de_la_personne).label}
                          size="small"
                          color={getEtat_de_la_personne(patient.etat_de_la_personne).color}
                          variant="outlined"
                          sx={{ fontWeight: 'medium', minWidth: 100 }}
                        />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{patient.cin_number || 'Inconnu'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={patient.genre || 'Inconnu'}
                        color={genreColors[patient.genre]}
                        size="small"
                        variant="filled"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Tooltip title="Voir détails">
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDialog('view', patient)}
                            color="primary"
                          >
                            <OpenInNewRounded fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Modifier">
                          <IconButton
                            size="small"
                            color="default"
                            onClick={() => handleOpenDialog('edit', patient)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Supprimer">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleOpenDialog('delete', patient)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredPatients.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page:"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count}`}
          sx={{ "& p": { mb: 0 } }}
        />
      </Paper>

      {/* Dialog for create/edit/view */}
      <Dialog
        open={openDialog && dialogMode !== 'delete'}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'create' ? 'Nouveau Patient' :
            dialogMode === 'edit' ? 'Modifier Patient' :
              `Détails du Patient ${selectedPatient?.first_name} ${selectedPatient?.last_name}`}
        </DialogTitle>
        {dialogMode === 'view' ? (
          <PatientDetail
            patient={selectedPatient}
            genreColors={genreColors}
            onClose={handleCloseDialog}
          />
        ) : (
          <PatientForm
            mode={dialogMode}
            initialData={selectedPatient}
            onSave={handleSavePatient}
            onClose={handleCloseDialog}
          />
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      {
        selectedPatient && (
          <Dialog
            open={openDialog && dialogMode === 'delete'}
            onClose={handleCloseDialog}
          >
            <DialogTitle>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <DeleteIcon color="error" />
                Confirmer la suppression
              </Box>
            </DialogTitle>
            <DialogContent>
              <Typography variant="body1" gutterBottom>
                Êtes-vous sûr de vouloir supprimer le patient
                <strong> {selectedPatient.firt_name} {selectedPatient.last_name} </strong>?
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Annuler
              </Button>
              <Button
                onClick={handleDeletePatient}
                color="error"
                variant="contained"
                startIcon={<DeleteIcon />}
              >
                Supprimer
              </Button>
            </DialogActions>
          </Dialog>
        )
      }
    </Box >
  );
};
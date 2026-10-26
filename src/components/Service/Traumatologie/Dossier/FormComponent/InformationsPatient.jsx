import { useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Box, TextField, Button, Chip, InputAdornment, Paper, Typography,
  FormControl, InputLabel, Select, MenuItem, IconButton, Grid, Autocomplete,
  Card, CardContent, Collapse, Dialog, DialogTitle, DialogContent, DialogActions,
  CircularProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { isAfter, isBefore, parseISO } from 'date-fns';
import {
  Search, FilterList, Clear, CalendarMonth, ExpandMore, ExpandLess,
  PersonOutline, Badge, Wc, Today, AccessTime, PersonAdd
} from '@mui/icons-material';
import { useContext } from 'react';
import { UserContext } from '../../../../../utils/UserContext';
import { apiTogetAll, apiToPost } from '../../../../../utils/ApiServices';
import axios from 'axios';
import { debounce } from 'lodash';

export const InformationsPatient = ({ formData, handleChangeNoSection, handleNext, setError, setPatient }) => {
  const [patientData, setPatientData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [shouldGoNext, setShouldGoNext] = useState(false);
  const { user } = useContext(UserContext);

  const [filters, setFilters] = useState({
    first_name: '',
    last_name: '',
    cin_number: '',
    birth_date: null,
    ageType: 'none',
    ageExact: '',
    ageMin: '',
    ageMax: '',
    genre: '',
    dateEnregistrementDebut: null,
    dateEnregistrementFin: null,
  });

  const [showAddPatientDialog, setShowAddPatientDialog] = useState(false);
  const [newPatient, setNewPatient] = useState({
    first_name: '',
    last_name: '',
    cin_number: '',
    birth_date: null,
    genre: '',
  });

  const debouncedSearchChange = useCallback(
    debounce((value) => {
      setSearchQuery(value);
      if (value.trim()) {
        setHasSearched(true);
      }
    }, 300),
    []
  );

  useEffect(() => {
    return () => {
      if (debouncedSearchChange?.cancel) {
        debouncedSearchChange.cancel();
      }
    };
  }, [debouncedSearchChange]);

  const selectOnePatient = useCallback((onePatient) => {
    if (!user || !user.hospital) {
      setError("L'hôpital de l'utilisateur n'est pas défini.");
      return;
    }
    if (!onePatient) {
      setError("L'ID du patient sélectionné est invalide.");
      return;
    }
    handleChangeNoSection('patient')(onePatient.id);
    handleChangeNoSection('hospital')(user.hospital.id);
    handleChangeNoSection('service')(user.service.id);
    handleChangeNoSection('enregistrator')(user.id);
    handleChangeNoSection('patient_id')(onePatient.id);
    handleChangeNoSection('hospital_id')(user.hospital.id);
    handleChangeNoSection('service_id')(user.service.id);
    handleChangeNoSection('enregistrator_id')(user.id);

    setPatient(onePatient);
    setShouldGoNext(true);
  }, [handleChangeNoSection, setError, user, setPatient]);

  useEffect(() => {
    if (shouldGoNext) {
      setShouldGoNext(false);
      handleNext();
    }
  }, [shouldGoNext, handleNext]);

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true);
        const response = await apiTogetAll('patient/');
        setPatientData(Array.isArray(response) ? response : []);
      } catch (err) {
        console.error('Erreur lors du chargement des patients:', err);
        setError("Impossible de charger les données des patients.");
        setPatientData([]);
      } finally {
        setLoading(false);
      }
    };
    loadPatients();
  }, [setError]);

  const uniqueFirstNames = useMemo(() => {
    return [...new Set(patientData.map(p => p.first_name).filter(Boolean))].sort();
  }, [patientData]);

  const uniqueLastNames = useMemo(() => {
    return [...new Set(patientData.map(p => p.last_name).filter(Boolean))].sort();
  }, [patientData]);

  const uniqueCinNumbers = useMemo(() => {
    return [...new Set(patientData.map(p => p.cin_number).filter(Boolean))].sort();
  }, [patientData]);

  const calculateAge = useCallback((birthDateString) => {
    if (!birthDateString) return null;
    try {
      const today = new Date();
      const birth = new Date(birthDateString);

      // Vérification de la validité de la date
      if (isNaN(birth.getTime())) return null;

      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age >= 0 ? age : null;
    } catch (error) {
      console.error('Erreur lors du calcul de l\'âge:', error);
      return null;
    }
  }, []);

  const handleSearchChange = useCallback((value) => {
    debouncedSearchChange(value);
  }, [debouncedSearchChange]);

  const filteredPatients = useMemo(() => {
    if (!hasSearched) return [];

    let results = [...patientData];
    const normalizeString = (str) => (str || '').toString().toLowerCase().trim();

    // Recherche par texte
    const normalizedQuery = normalizeString(searchQuery);
    if (normalizedQuery) {
      results = results.filter(patient =>
        normalizeString(patient.first_name).includes(normalizedQuery) ||
        normalizeString(patient.last_name).includes(normalizedQuery) ||
        normalizeString(patient.cin_number).includes(normalizedQuery)
      );
    }

    // Application des filtres avancés
    if (filters.first_name) {
      results = results.filter(p => normalizeString(p.first_name).includes(normalizeString(filters.first_name)));
    }
    if (filters.last_name) {
      results = results.filter(p => normalizeString(p.last_name).includes(normalizeString(filters.last_name)));
    }
    if (filters.cin_number) {
      results = results.filter(p => normalizeString(p.cin_number).includes(normalizeString(filters.cin_number)));
    }
    if (filters.genre) {
      results = results.filter(p => p.genre === filters.genre);
    }

    // Calcul de l'âge pour chaque patient
    results = results.map(p => ({
      ...p,
      calculatedAge: p.age || calculateAge(p.birth_date)
    }));

    // Filtres par âge
    if (filters.ageType === 'exact' && filters.ageExact) {
      const exactAge = parseInt(filters.ageExact, 10);
      if (!isNaN(exactAge)) {
        results = results.filter(p => p.calculatedAge === exactAge);
      }
    }
    if (filters.ageType === 'range') {
      const minAge = filters.ageMin ? parseInt(filters.ageMin, 10) : 0;
      const maxAge = filters.ageMax ? parseInt(filters.ageMax, 10) : Infinity;
      if (!isNaN(minAge) && !isNaN(maxAge)) {
        results = results.filter(p =>
          p.calculatedAge !== null &&
          p.calculatedAge >= minAge &&
          p.calculatedAge <= maxAge
        );
      }
    }

    // Filtre par date de naissance
    if (filters.birth_date) {
      results = results.filter(p => {
        if (!p.birth_date) return false;
        try {
          const patientBirthDate = new Date(p.birth_date);
          const filterDate = new Date(filters.birth_date);
          return patientBirthDate.toDateString() === filterDate.toDateString();
        } catch (error) {
          console.error('Erreur lors de la comparaison des dates:', error);
          return false;
        }
      });
    }

    // Filtres par date d'enregistrement
    if (filters.dateEnregistrementDebut) {
      results = results.filter(p => {
        if (!p.date_registered) return false;
        try {
          const patientRegisteredDate = new Date(p.date_registered);
          const startDate = new Date(filters.dateEnregistrementDebut);
          return patientRegisteredDate >= startDate;
        } catch (error) {
          console.error('Erreur lors de la comparaison des dates d\'enregistrement:', error);
          return false;
        }
      });
    }
    if (filters.dateEnregistrementFin) {
      results = results.filter(p => {
        if (!p.date_registered) return false;
        try {
          const patientRegisteredDate = new Date(p.date_registered);
          const endDate = new Date(filters.dateEnregistrementFin);
          return patientRegisteredDate <= endDate;
        } catch (error) {
          console.error('Erreur lors de la comparaison des dates d\'enregistrement:', error);
          return false;
        }
      });
    }

    return results.sort((a, b) => {
      // Tri par nom puis prénom
      const lastNameComparison = (a.last_name || '').localeCompare(b.last_name || '');
      if (lastNameComparison !== 0) return lastNameComparison;
      return (a.first_name || '').localeCompare(b.first_name || '');
    });
  }, [patientData, searchQuery, filters, hasSearched, calculateAge]);

  const handleFilterChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setFilters(prev => ({
      ...prev,
      [field]: value === '' ? (field === 'birth_date' || field.includes('date') ? null : '') : value,
    }));
  }, []);

  const handleDateChange = useCallback((field) => (date) => {
    setFilters(prev => ({
      ...prev,
      [field]: date,
    }));
  }, []);

  const handleAgeTypeChange = useCallback((event) => {
    const ageType = event.target.value;
    setFilters(prev => ({
      ...prev,
      ageType,
      ageExact: ageType === 'exact' ? prev.ageExact : '',
      ageMin: ageType === 'range' ? prev.ageMin : '',
      ageMax: ageType === 'range' ? prev.ageMax : '',
    }));
  }, []);

  const handleQuickSearch = useCallback(() => {
    setHasSearched(true);
  }, []);

  const applyFilters = useCallback(() => {
    setLoading(true);
    setHasSearched(true);
    // Simulation d'un délai de traitement
    setTimeout(() => setLoading(false), 100);
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setFilters({
      first_name: '',
      last_name: '',
      cin_number: '',
      birth_date: null,
      ageType: 'none',
      ageExact: '',
      ageMin: '',
      ageMax: '',
      genre: '',
      dateEnregistrementDebut: null,
      dateEnregistrementFin: null,
    });
    setHasSearched(false);
    debouncedSearchChange.cancel();
  }, [debouncedSearchChange]);

  const activeFilters = useMemo(() => {
    const newActiveFilters = [];
    if (filters.first_name) newActiveFilters.push({ key: 'first_name', label: `Prénom: ${filters.first_name}` });
    if (filters.last_name) newActiveFilters.push({ key: 'last_name', label: `Nom: ${filters.last_name}` });
    if (filters.cin_number) newActiveFilters.push({ key: 'cin_number', label: `CIN: ${filters.cin_number}` });
    if (filters.genre) newActiveFilters.push({ key: 'genre', label: `Genre: ${filters.genre}` });
    if (filters.birth_date) {
      try {
        newActiveFilters.push({ key: 'birth_date', label: `Né(e) le: ${new Date(filters.birth_date).toLocaleDateString('fr-FR')}` });
      } catch (error) {
        console.error('Erreur lors du formatage de la date:', error);
      }
    }
    if (filters.ageType === 'exact' && filters.ageExact) {
      newActiveFilters.push({ key: 'ageExact', label: `Âge: ${filters.ageExact} ans` });
    }
    if (filters.ageType === 'range' && (filters.ageMin || filters.ageMax)) {
      newActiveFilters.push({ key: 'ageRange', label: `Âge: ${filters.ageMin || 'min'} - ${filters.ageMax || 'max'} ans` });
    }
    if (filters.dateEnregistrementDebut || filters.dateEnregistrementFin) {
      try {
        const debut = filters.dateEnregistrementDebut ? new Date(filters.dateEnregistrementDebut).toLocaleDateString('fr-FR') : '...';
        const fin = filters.dateEnregistrementFin ? new Date(filters.dateEnregistrementFin).toLocaleDateString('fr-FR') : '...';
        newActiveFilters.push({ key: 'date_registered', label: `Enregistré du ${debut} au ${fin}` });
      } catch (error) {
        console.error('Erreur lors du formatage des dates:', error);
      }
    }
    return newActiveFilters;
  }, [filters]);

  const removeFilter = useCallback((key) => {
    setFilters(prev => {
      const newState = { ...prev };
      if (key === 'ageRange' || key === 'ageExact') {
        newState.ageType = 'none';
        newState.ageExact = '';
        newState.ageMin = '';
        newState.ageMax = '';
      } else if (key === 'date_registered') {
        newState.dateEnregistrementDebut = null;
        newState.dateEnregistrementFin = null;
      } else if (key === 'birth_date') {
        newState.birth_date = null;
      } else {
        newState[key] = '';
      }
      return newState;
    });
  }, []);

  const handleNewPatientChange = useCallback((field) => (event) => {
    const value = event.target.value;
    setNewPatient(prev => ({
      ...prev,
      [field]: value === '' ? (field === 'birth_date' ? null : '') : value,
    }));
  }, []);

  const handleNewPatientDateChange = useCallback((date) => {
    setNewPatient(prev => ({
      ...prev,
      birth_date: date,
    }));
  }, []);

  const validateNewPatient = useCallback(() => {
    if (!newPatient.last_name?.trim()) {
      return "Le nom du patient est requis.";
    }

    if (newPatient.birth_date && isAfter(new Date(newPatient.birth_date), new Date())) {
      return "La date de naissance ne peut pas être dans le futur.";
    }

    if (newPatient.cin_number && !/^\d{8,12}$/.test(newPatient.cin_number.trim())) {
      return "Le numéro CIN doit contenir entre 8 et 12 chiffres.";
    }

    const isAnyFieldFilled = newPatient.first_name?.trim() ||
      newPatient.last_name?.trim() ||
      newPatient.cin_number?.trim() ||
      newPatient.birth_date ||
      newPatient.genre;

    if (!isAnyFieldFilled) {
      return "Veuillez renseigner au moins un champ pour créer le patient.";
    }

    return null;
  }, [newPatient]);

  const handleAddPatient = useCallback(async () => {
    const validationError = validateNewPatient();
    if (validationError) {
      setError(validationError);
      return;
    }

    const patientToCreate = {
      first_name: newPatient.first_name?.trim() || "Inconnu",
      last_name: newPatient.last_name?.trim(),
      cin_number: newPatient.cin_number?.trim() || null,
      cin_connu: Boolean(newPatient.cin_number?.trim()),
      birth_date: newPatient.birth_date
        ? new Date(newPatient.birth_date).toISOString().split("T")[0]
        : null,
      age_connu: Boolean(newPatient.birth_date),
      age: newPatient.birth_date ? calculateAge(new Date(newPatient.birth_date).toISOString().split("T")[0]) : null,
      genre: newPatient.genre || null,
      registered_by: user?.id || null,
    };

    try {
      setLoading(true);
      const createdPatient = await apiToPost('patient/', patientToCreate);
      setPatientData((prev) => [createdPatient, ...prev]);
      setShowAddPatientDialog(false);
      setNewPatient({
        first_name: '',
        last_name: '',
        cin_number: '',
        birth_date: null,
        genre: ''
      });
      setHasSearched(true);
      selectOnePatient(createdPatient);
    } catch (error) {
      console.error('Erreur lors de l\'ajout du patient:', error);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        "Erreur lors de l'ajout du patient. Veuillez réessayer.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [newPatient, user, calculateAge, selectOnePatient, setError, validateNewPatient]);

  const openAddPatientDialog = useCallback(() => {
    if (searchQuery.trim()) {
      const terms = searchQuery.trim().split(/\s+/);
      setNewPatient(prev => ({
        ...prev,
        first_name: terms[0] || '',
        last_name: terms.slice(1).join(' ') || '',
      }));
    }
    setShowAddPatientDialog(true);
  }, [searchQuery]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return 'Date non disponible';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR');
    } catch (error) {
      console.error('Erreur lors du formatage de la date:', error);
      return 'Date invalide';
    }
  }, []);

  if (loading && !patientData.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
      <Box sx={{ p: 2, maxWidth: 1200, mx: 'auto', }}>
        <Paper
          elevation={2}
          sx={{
            p: 1,
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            borderRadius: 2,
          }}
        >
          <Autocomplete
            disablePortal
            popperprops={{
              style: { zIndex: 1200 },
            }}
            fullWidth
            options={filteredPatients}
            getOptionLabel={(patient) =>
              `${patient.first_name || ''} ${patient.last_name || ''} (CIN: ${patient.cin_number || 'Non renseigné'})`
            }
            onInputChange={(event, newInputValue) => {
              handleSearchChange(newInputValue);
            }}
            onChange={(event, newValue) => {
              if (newValue) {
                selectOnePatient(newValue);
              }
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Rechercher et sélectionner un patient par nom, prénom ou CIN..."
                variant="outlined"
                size="small"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress size={20} /> : null}
                      {searchQuery && (
                        <InputAdornment position="end">
                          <IconButton size="small" onClick={() => handleSearchChange('')}>
                            <Clear fontSize="small" />
                          </IconButton>
                        </InputAdornment>
                      )}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            renderOption={(props, patient) => (
              <li {...props}>
                <Box sx={{ display: 'flex', flexDirection: 'column', py: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                    {patient.first_name} {patient.last_name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    CIN: {patient.cin_number || 'Non renseigné'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {patient.genre ? (patient.genre === 'Homme' ? 'Homme' : 'Femme') : 'Genre non connu'},{' '}
                    {patient.calculatedAge !== null ? `${patient.calculatedAge} ans` : 'âge non connu'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Enregistré le {formatDate(patient.date_registered)}
                  </Typography>
                </Box>
              </li>
            )}
            noOptionsText={
              <Box sx={{ textAlign: 'center', py: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Aucun patient trouvé. Voulez-vous en ajouter un ?
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PersonAdd />}
                  onClick={openAddPatientDialog}
                  size="large"
                  disabled={loading}
                >
                  Ajouter un nouveau patient
                </Button>
              </Box>
            }
            loading={loading}
            sx={{ mr: 1 }}
          />
          <Button
            variant={showAdvancedFilters ? "contained" : "outlined"}
            color={showAdvancedFilters ? "primary" : "inherit"}
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            endIcon={showAdvancedFilters ? <ExpandLess /> : <ExpandMore />}
            sx={{ whiteSpace: 'nowrap' }}
            disabled={loading}
          >
            Filtres
          </Button>
        </Paper>

        {activeFilters.length > 0 && (
          <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {activeFilters.map((filter) => (
              <Chip
                key={filter.key}
                label={filter.label}
                onDelete={() => removeFilter(filter.key)}
                color="primary"
                variant="outlined"
              />
            ))}
            <Chip
              label="Effacer tous les filtres"
              onDelete={resetFilters}
              color="error"
            />
          </Box>
        )}

        <Collapse in={showAdvancedFilters}>
          <Card variant="outlined" sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Filtres avancés
              </Typography>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', mb: 2 }}>
                    <PersonOutline /> Identité
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Autocomplete
                      options={uniqueFirstNames}
                      value={filters.first_name || null}
                      onChange={(event, newValue) => setFilters(prev => ({ ...prev, first_name: newValue || '' }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Prénom" size="small" fullWidth />
                      )}
                      freeSolo
                    />
                    <Autocomplete
                      options={uniqueLastNames}
                      value={filters.last_name || null}
                      onChange={(event, newValue) => setFilters(prev => ({ ...prev, last_name: newValue || '' }))}
                      renderInput={(params) => (
                        <TextField {...params} label="Nom" size="small" fullWidth />
                      )}
                      freeSolo
                    />
                    <Autocomplete
                      options={uniqueCinNumbers}
                      value={filters.cin_number || null}
                      onChange={(event, newValue) => setFilters(prev => ({ ...prev, cin_number: newValue || '' }))}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Numéro CIN"
                          size="small"
                          fullWidth
                          InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                              <>
                                <InputAdornment position="start">
                                  <Badge fontSize="small" />
                                </InputAdornment>
                                {params.InputProps.startAdornment}
                              </>
                            )
                          }}
                        />
                      )}
                      freeSolo
                    />
                    <FormControl fullWidth size="small">
                      <InputLabel>Genre</InputLabel>
                      <Select
                        value={filters.genre}
                        onChange={handleFilterChange('genre')}
                        label="Genre"
                        startAdornment={<Wc sx={{ mr: 1, ml: -0.5 }} fontSize="small" />}
                      >
                        <MenuItem value=""><em>Tous les genres</em></MenuItem>
                        <MenuItem value="Homme">Homme</MenuItem>
                        <MenuItem value="Femme">Femme</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', mb: 2 }}>
                    <Today /> Âge et date de naissance
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Type de recherche par âge</InputLabel>
                      <Select
                        value={filters.ageType}
                        onChange={handleAgeTypeChange}
                        label="Type de recherche par âge"
                      >
                        <MenuItem value="none">Aucune recherche par âge</MenuItem>
                        <MenuItem value="exact">Âge exact</MenuItem>
                        <MenuItem value="range">Tranche d'âge</MenuItem>
                      </Select>
                    </FormControl>
                    {filters.ageType === 'exact' && (
                      <TextField
                        fullWidth
                        label="Âge exact"
                        type="number"
                        size="small"
                        value={filters.ageExact}
                        onChange={handleFilterChange('ageExact')}
                        InputProps={{
                          inputProps: { min: 0, max: 120 },
                          endAdornment: <InputAdornment position="end">ans</InputAdornment>
                        }}
                      />
                    )}
                    {filters.ageType === 'range' && (
                      <Grid container spacing={2}>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Âge minimum"
                            type="number"
                            size="small"
                            value={filters.ageMin}
                            onChange={handleFilterChange('ageMin')}
                            InputProps={{
                              inputProps: { min: 0, max: 120 },
                              endAdornment: <InputAdornment position="end">ans</InputAdornment>
                            }}
                          />
                        </Grid>
                        <Grid size={{ xs: 6 }}>
                          <TextField
                            fullWidth
                            label="Âge maximum"
                            type="number"
                            size="small"
                            value={filters.ageMax}
                            onChange={handleFilterChange('ageMax')}
                            InputProps={{
                              inputProps: { min: 0, max: 120 },
                              endAdornment: <InputAdornment position="end">ans</InputAdornment>
                            }}
                          />
                        </Grid>
                      </Grid>
                    )}
                    <DatePicker
                      label="Date de naissance"
                      value={filters.birth_date}
                      onChange={handleDateChange('birth_date')}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true,
                          InputProps: {
                            startAdornment: (
                              <InputAdornment position="start">
                                <CalendarMonth fontSize="small" />
                              </InputAdornment>
                            )
                          }
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold', mb: 2 }}>
                    <AccessTime /> Date d'enregistrement
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <DatePicker
                      label="Date de début"
                      value={filters.dateEnregistrementDebut}
                      onChange={handleDateChange('dateEnregistrementDebut')}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true
                        }
                      }}
                    />
                    <DatePicker
                      label="Date de fin"
                      value={filters.dateEnregistrementFin}
                      onChange={handleDateChange('dateEnregistrementFin')}
                      slotProps={{
                        textField: {
                          size: "small",
                          fullWidth: true
                        }
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={resetFilters}
                  startIcon={<Clear />}
                >
                  Réinitialiser
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={applyFilters}
                  startIcon={<FilterList />}
                >
                  Appliquer les filtres
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Collapse>

        <Dialog
          open={showAddPatientDialog}
          onClose={() => setShowAddPatientDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAdd />
            Ajouter un nouveau patient
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
              <TextField
                fullWidth
                label="Prénom"
                value={newPatient.first_name}
                onChange={handleNewPatientChange('first_name')}
                size="small"
                inputProps={{ maxLength: 255 }}
              />
              <TextField
                fullWidth
                label="Nom"
                value={newPatient.last_name}
                onChange={handleNewPatientChange('last_name')}
                size="small"
                inputProps={{ maxLength: 255 }}
                required
                error={!newPatient.last_name?.trim()}
                helperText={!newPatient.last_name?.trim() ? "Le nom est requis" : ""}
              />
              <TextField
                fullWidth
                label="Numéro CIN"
                value={newPatient.cin_number}
                onChange={handleNewPatientChange('cin_number')}
                size="small"
                inputProps={{ maxLength: 12 }}
                error={newPatient.cin_number && !/^\d{8,12}$/.test(newPatient.cin_number)}
                helperText={newPatient.cin_number && !/^\d{8,12}$/.test(newPatient.cin_number) ? "Le CIN doit contenir entre 8 et 12 chiffres" : ""}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Badge fontSize="small" />
                    </InputAdornment>
                  )
                }}
              />
              <FormControl fullWidth size="small">
                <InputLabel>Genre</InputLabel>
                <Select
                  value={newPatient.genre}
                  onChange={handleNewPatientChange('genre')}
                  label="Genre"
                  startAdornment={<Wc sx={{ mr: 1, ml: -0.5 }} fontSize="small" />}
                >
                  <MenuItem value=""><em>Non renseigné</em></MenuItem>
                  <MenuItem value="Homme">Homme</MenuItem>
                  <MenuItem value="Femme">Femme</MenuItem>
                </Select>
              </FormControl>
              <DatePicker
                label="Date de naissance"
                value={newPatient.birth_date}
                onChange={handleNewPatientDateChange}
                maxDate={new Date()}
                slotProps={{
                  textField: {
                    size: "small",
                    fullWidth: true,
                    error: newPatient.birth_date && isAfter(new Date(newPatient.birth_date), new Date()),
                    helperText: newPatient.birth_date && isAfter(new Date(newPatient.birth_date), new Date()) ? "La date ne peut pas être dans le futur" : "",
                    InputProps: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <CalendarMonth fontSize="small" />
                        </InputAdornment>
                      )
                    }
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 1 }}>
            <Button
              onClick={() => setShowAddPatientDialog(false)}
              disabled={loading}
            >
              Annuler
            </Button>
            <Button
              onClick={handleAddPatient}
              variant="contained"
              color="primary"
              disabled={loading || !newPatient.last_name?.trim()}
            >
              {loading ? <CircularProgress size={24} /> : 'Ajouter'}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

InformationsPatient.propTypes = {
  formData: PropTypes.shape({
    patient: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
    hospital: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
    enregistrator: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
    patient_id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    hospital_id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
    enregistrator_id: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
  }).isRequired,
  setPatient: PropTypes.func.isRequired,
  handleChangeNoSection: PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
};
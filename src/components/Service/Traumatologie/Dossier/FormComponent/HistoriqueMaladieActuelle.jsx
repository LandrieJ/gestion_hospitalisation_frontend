import { useEffect, useCallback } from 'react';
import { Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';
import { useState } from 'react';

export const HistoriqueMaladieActuelle = ({ formData, handleChange, handleDateChange, AdapterDateFns, setError }) => {
  const [lieuAccidentChoices, setLieuAccidentChoices] = useState([
    { value: 'domicile', label: 'Domicile' },
    { value: 'travail', label: 'Travail' },
    { value: 'voie_publique', label: 'Voie publique' },
    { value: 'autre', label: 'Autre' }
  ]);
  const [activiteChoices, setActiviteChoices] = useState([
    { value: 'travail', label: 'Travail' },
    { value: 'sport', label: 'Sport' },
    { value: 'loisir', label: 'Loisir' },
    { value: 'autre', label: 'Autre' }
  ]);
  const [mecanismeChoices, setMecanismeChoices] = useState([
    { value: 'chute', label: 'Chute' },
    { value: 'collision', label: 'Collision' },
    { value: 'agression', label: 'Agression' },
    { value: 'autre', label: 'Autre' }
  ]);
  const [materielProtectionChoices, setMaterielProtectionChoices] = useState([
    { value: 'casque', label: 'Casque' },
    { value: 'ceinture', label: 'Ceinture de sécurité' },
    { value: 'multiple', label: 'Multiples protections' },
    { value: 'autre', label: 'Autre' }
  ]);
  const [substanceChoices, setSubstanceChoices] = useState([
    { value: 'aucune', label: 'Aucune' },
    { value: 'drogue', label: 'Drogue' },
    { value: 'medicament', label: 'Médicament' },
    { value: 'multiple', label: 'Multiple' }
  ]);
  const [alcoolChoices, setAlcoolChoices] = useState([
    { value: 'non', label: 'Non' },
    { value: 'oui', label: 'Oui' },
    { value: 'inconnu', label: 'Inconnu' }
  ]);

  // useEffect(() => {
  //   const fetchChoices = async () => {
  //     try {
  //       const [lieu, activite, mecanisme, materiel, substance, alcool] = await Promise.all([
  //         apiTogetAll('lieu-accident-choices'),
  //         apiTogetAll('activite-lors-accident-choices'),
  //         apiTogetAll('mecanisme-accident-choices'),
  //         apiTogetAll('materiel-protection-choices'),
  //         apiTogetAll('consommation-substance-choices'),
  //         apiTogetAll('consommation-alcool-choices')
  //       ]);
  //       setLieuAccidentChoices(lieu);
  //       setActiviteChoices(activite);
  //       setMecanismeChoices(mecanisme);
  //       setMaterielProtectionChoices(materiel);
  //       setSubstanceChoices(substance);
  //       setAlcoolChoices(alcool);
  //     } catch (error) {
  //       setError('Impossible de charger les options du formulaire.');
  //     }
  //   };
  //   fetchChoices();
  // }, [setError]);

  useEffect(() => {
    if (formData.historique_maladie_actuelle_data?.lieu_accident !== 'autre') {
      handleChange('historique_maladie_actuelle_data', 'autre_lieu_accident')({ target: { value: null } });
    }
    if (formData.historique_maladie_actuelle_data?.activite_lors_accident !== 'autre') {
      handleChange('historique_maladie_actuelle_data', 'autre_activite_lors_accident')({ target: { value: null } });
    }
    if (formData.historique_maladie_actuelle_data?.mecanisme_accident !== 'autre') {
      handleChange('historique_maladie_actuelle_data', 'autre_mecanisme_accident')({ target: { value: null } });
    }
    if (formData.historique_maladie_actuelle_data?.materiel_protection !== 'autre') {
      handleChange('historique_maladie_actuelle_data', 'autre_materiel_protection')({ target: { value: null } });
    }
  }, [
    formData.historique_maladie_actuelle_data?.lieu_accident,
    formData.historique_maladie_actuelle_data?.activite_lors_accident,
    formData.historique_maladie_actuelle_data?.mecanisme_accident,
    formData.historique_maladie_actuelle_data?.materiel_protection,
  ]);

  const handleTextChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    if (field === 'autre_lieu_accident' && formData.historique_maladie_actuelle_data?.lieu_accident === 'autre' && !value) {
      setError("Préciser le lieu de l'accident est requis lorsque 'Autre' est sélectionné.");
      return;
    }
    if (field === 'autre_activite_lors_accident' && formData.historique_maladie_actuelle_data?.activite_lors_accident === 'autre' && !value) {
      setError("Préciser l'activité lors de l'accident est requis lorsque 'Autre' est sélectionné.");
      return;
    }
    if (field === 'autre_mecanisme_accident' && formData.historique_maladie_actuelle_data?.mecanisme_accident === 'autre' && !value) {
      setError("Préciser le mécanisme de l'accident est requis lorsque 'Autre' est sélectionné.");
      return;
    }
    if (field === 'autre_materiel_protection' && formData.historique_maladie_actuelle_data?.materiel_protection === 'autre' && !value) {
      setError("Préciser le matériel de protection est requis lorsque 'Autre' est sélectionné.");
      return;
    }
    handleChange('historique_maladie_actuelle_data', field)(value);
  }, [
    handleChange,
    formData.historique_maladie_actuelle_data?.lieu_accident,
    formData.historique_maladie_actuelle_data?.activite_lors_accident,
    formData.historique_maladie_actuelle_data?.mecanisme_accident,
    formData.historique_maladie_actuelle_data?.materiel_protection,
    setError
  ]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
          <DatePicker
            label="Date de l'accident"
            value={formData.historique_maladie_actuelle_data?.date_accident
              ? new Date(formData.historique_maladie_actuelle_data.date_accident)
              : null}
            onChange={(date) => {
              if (date && date > new Date()) {
                setError("La date de l'accident ne peut pas être dans le futur.");
                return;
              }
              handleDateChange('historique_maladie_actuelle_data', 'date_accident')(date);
            }}
            slotProps={{ textField: { fullWidth: true, margin: 'normal', 'aria-describedby': 'date-accident-error' } }}
          />
        </LocalizationProvider>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="lieu-accident-label">Lieu de l'accident</InputLabel>
          <Select
            labelId="lieu-accident-label"
            value={formData.historique_maladie_actuelle_data?.lieu_accident || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'lieu_accident')}
            label="Lieu de l'accident"
            aria-describedby="lieu-accident-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {lieuAccidentChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {formData.historique_maladie_actuelle_data?.lieu_accident === 'autre' && (
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser le lieu de l'accident"
            value={formData.historique_maladie_actuelle_data?.autre_lieu_accident || ''}
            onChange={handleTextChange('autre_lieu_accident')}
            aria-describedby="autre-lieu-accident-error"
          />
          {formData.historique_maladie_actuelle_data?.lieu_accident === 'autre' && !formData.historique_maladie_actuelle_data?.autre_lieu_accident && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="activite-accident-label">Activité lors de l'accident</InputLabel>
          <Select
            labelId="activite-accident-label"
            value={formData.historique_maladie_actuelle_data?.activite_lors_accident || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'activite_lors_accident')}
            label="Activité lors de l'accident"
            aria-describedby="activite-accident-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {activiteChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {formData.historique_maladie_actuelle_data?.activite_lors_accident === 'autre' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser l'activité lors de l'accident"
            value={formData.historique_maladie_actuelle_data?.autre_activite_lors_accident || ''}
            onChange={handleTextChange('autre_activite_lors_accident')}
            aria-describedby="autre-activite-accident-error"
          />
          {formData.historique_maladie_actuelle_data?.activite_lors_accident === 'autre' && !formData.historique_maladie_actuelle_data?.autre_activite_lors_accident && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="mecanisme-accident-label">Mécanisme de l'accident</InputLabel>
          <Select
            labelId="mecanisme-accident-label"
            value={formData.historique_maladie_actuelle_data?.mecanisme_accident || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'mecanisme_accident')}
            label="Mécanisme de l'accident"
            aria-describedby="mecanisme-accident-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {mecanismeChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {formData.historique_maladie_actuelle_data?.mecanisme_accident === 'autre' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser le mécanisme de l'accident"
            value={formData.historique_maladie_actuelle_data?.autre_mecanisme_accident || ''}
            onChange={handleTextChange('autre_mecanisme_accident')}
            aria-describedby="autre-mecanisme-accident-error"
          />
          {formData.historique_maladie_actuelle_data?.mecanisme_accident === 'autre' && !formData.historique_maladie_actuelle_data?.autre_mecanisme_accident && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="materiel-protection-label">Matériel de protection</InputLabel>
          <Select
            labelId="materiel-protection-label"
            value={formData.historique_maladie_actuelle_data?.materiel_protection || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'materiel_protection')}
            label="Matériel de protection"
            aria-describedby="materiel-protection-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {materielProtectionChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {formData.historique_maladie_actuelle_data?.materiel_protection === 'autre' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser le matériel de protection"
            value={formData.historique_maladie_actuelle_data?.autre_materiel_protection || ''}
            onChange={handleTextChange('autre_materiel_protection')}
            aria-describedby="autre-materiel-protection-error"
          />
          {formData.historique_maladie_actuelle_data?.materiel_protection === 'autre' && !formData.historique_maladie_actuelle_data?.autre_materiel_protection && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </Grid>
      )}
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.mecanisme_supplementaire || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'mecanisme_supplementaire')}
            />
          }
          label="Mécanisme supplémentaire"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.protection_utilisee || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'protection_utilisee')}
            />
          }
          label="Protection utilisée"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.intentionnel || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'intentionnel')}
            />
          }
          label="Accident intentionnel"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.soins_prehospitaliers || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'soins_prehospitaliers')}
            />
          }
          label="Soins préhospitaliers"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.prise_en_charge_medical_lieu_accident_lors_transport || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'prise_en_charge_medical_lieu_accident_lors_transport')}
            />
          }
          label="Prise en charge médicale sur le lieu de l'accident ou lors du transport"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.historique_maladie_actuelle_data?.procedure_supplementaire || false}
              onChange={handleChange('historique_maladie_actuelle_data', 'procedure_supplementaire')}
            />
          }
          label="Procédure supplémentaire"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="consommation-substance-label">Consommation de substances</InputLabel>
          <Select
            labelId="consommation-substance-label"
            value={formData.historique_maladie_actuelle_data?.consommation_substance || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'consommation_substance')}
            label="Consommation de substances"
            aria-describedby="consommation-substance-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {substanceChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="consommation-alcool-label">Consommation d'alcool</InputLabel>
          <Select
            labelId="consommation-alcool-label"
            value={formData.historique_maladie_actuelle_data?.consommation_alcool || ''}
            onChange={handleChange('historique_maladie_actuelle_data', 'consommation_alcool')}
            label="Consommation d'alcool"
            aria-describedby="consommation-alcool-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {alcoolChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

HistoriqueMaladieActuelle.propTypes = {
  formData: PropTypes.shape({
    historique_maladie_actuelle_data: PropTypes.shape({
      date_accident: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.oneOf([null])]),
      lieu_accident: PropTypes.string,
      autre_lieu_accident: PropTypes.string,
      activite_lors_accident: PropTypes.string,
      autre_activite_lors_accident: PropTypes.string,
      mecanisme_accident: PropTypes.string,
      autre_mecanisme_accident: PropTypes.string,
      materiel_protection: PropTypes.string,
      autre_materiel_protection: PropTypes.string,
      mecanisme_supplementaire: PropTypes.bool,
      protection_utilisee: PropTypes.bool,
      intentionnel: PropTypes.bool,
      soins_prehospitaliers: PropTypes.bool,
      prise_en_charge_medical_lieu_accident_lors_transport: PropTypes.bool,
      procedure_supplementaire: PropTypes.bool,
      consommation_substance: PropTypes.string,
      consommation_alcool: PropTypes.string
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  AdapterDateFns: PropTypes.func.isRequired,
  setError: PropTypes.func
};
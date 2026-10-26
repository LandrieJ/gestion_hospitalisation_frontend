import { useState, useEffect } from 'react';
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { fr } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';
import { useCallback } from 'react';
import { isAfter } from 'date-fns';

export const InformationsVariantesPatient = ({ formData, AdapterDateFns, handleChange, handleDateChange, handleChangeNoSection, setError }) => {
  const [modeArriveeChoices, setModeArriveeChoices] = useState([
    { value: 'ambulance', label: 'Ambulance' },
    { value: 'vehicule_personnel', label: 'Véhicule personnel' },
    { value: 'helicoptere', label: 'Hélicoptère' },
    { value: 'autre', label: 'Autre' }
  ]);
  const [classificationProfessionChoices, setClassificationProfessionChoices] = useState([
    { value: 'medicale', label: 'Médicale' },
    { value: 'juridique', label: 'Juridique' },
    { value: 'technique', label: 'Technique' },
    { value: 'autre', label: 'Autre' }
  ]);

  // Charger les choix dynamiquement depuis l'API (optionnel)
  // useEffect(() => {
  //   const fetchChoices = async () => {
  //     try {
  //       const [modeArriveeData, classificationProfessionData] = await Promise.all([
  //         apiTogetAll('mode-arrivee-choices'), // Supposons un endpoint pour les choix
  //         apiTogetAll('classification-profession-choices')
  //       ]);
  //       setModeArriveeChoices(modeArriveeData);
  //       setClassificationProfessionChoices(classificationProfessionData);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des choix:", error);
  //     }
  //   };
  //   fetchChoices();
  // }, []);

  // Gérer les changements pour les champs imbriqués de geolocalisation
  const handleGeolocalisationChange = useCallback((field) => (event) => {
    let value = event.target.value === '' ? null : event.target.value;
    if (field === 'latitude' && value !== null) {
      value = Number(value);
      if (value < -90 || value > 90) {
        setError('La latitude doit être comprise entre -90 et 90.');
        return;
      }
    }
    if (field === 'longitude' && value !== null) {
      value = Number(value);
      if (value < -180 || value > 180) {
        setError('La longitude doit être comprise entre -180 et 180.');
        return;
      }
    }
    if (field === 'description' && value && value.length > 255) {
      setError('La description ne doit pas dépasser 255 caractères.');
      return;
    }
    handleChange('information_variant_patient_data', 'geolocalisation')({
      ...formData.information_variant_patient_data.geolocalisation,
      [field]: value
    });
  }, [handleChange, formData.information_variant_patient_data.geolocalisation, setError]);


  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Motif de consultation"
          placeholder='Ex: Accident de sport, chute, etc.'
          type="text"
          value={formData.motif_consultation || ''}
          onChange={(e) => handleChangeNoSection('motif_consultation')(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Commentaire général"
          placeholder="Ex: Patient conscient à l'arrivée"
          type="text"
          value={formData.commentaires_generaux || ''}
          onChange={(e) => handleChangeNoSection('commentaires_generaux')(e.target.value)}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="mode-arrivee-label">Mode d'arrivée</InputLabel>
          <Select
            labelId="mode-arrivee-label"
            value={formData.information_variant_patient_data.mode_arrivee || ''}
            onChange={handleChange('information_variant_patient_data', 'mode_arrivee')}
            label="Mode d'arrivée"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {modeArriveeChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>
                {choice.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      {formData.information_variant_patient_data.mode_arrivee === 'autre' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser le mode d'arrivée"
            value={formData.information_variant_patient_data.autre_mode_arrivee || ''}
            onChange={handleChange('information_variant_patient_data', 'autre_mode_arrivee')}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre de fréquentations médicales"
          type="number"
          value={formData.information_variant_patient_data.nombre_frequentations_medicales || ''}
          onChange={(e) => handleChange('information_variant_patient_data', 'nombre_frequentations_medicales')(e.target.value === '' ? null : Number(e.target.value))}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel>Classification de la profession</InputLabel>
          <Select
            value={formData.information_variant_patient_data.classification_profession || ''}
            onChange={handleChange('information_variant_patient_data', 'classification_profession')}
            label="Classification de la profession"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {classificationProfessionChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>
                {choice.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Profession spécifique"
          placeholder='Ex: Chauffeur, athlète etc.'
          value={formData.information_variant_patient_data.profession_specifique || ''}
          onChange={handleChange('information_variant_patient_data', 'profession_specifique')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Domicile"
          placeholder='Ex: Appartement, maison, etc.'
          value={formData.information_variant_patient_data.domicile || ''}
          onChange={handleChange('information_variant_patient_data', 'domicile')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Domicile secondaire"
          placeholder='Ex: Appartement, maison, etc.'
          value={formData.information_variant_patient_data.residence_secondaire || ''}
          onChange={handleChange('information_variant_patient_data', 'residence_secondaire')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Lieu de l'accident"
          placeholder='Ex: Route, domicile, etc.'
          value={formData.information_variant_patient_data.lieu_accident || ''}
          onChange={handleChange('information_variant_patient_data', 'lieu_accident')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>
          Géolocalisation
        </Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Latitude"
          placeholder='Ex: 48.8566'
          type="number"
          value={formData.information_variant_patient_data.geolocalisation?.latitude || ''}
          onChange={handleGeolocalisationChange('latitude')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Longitude"
          placeholder='Ex: 2.3522'
          type="number"
          value={formData.information_variant_patient_data.geolocalisation?.longitude || ''}
          onChange={handleGeolocalisationChange('longitude')}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Description"
          placeholder="Ex: Description de l'emplacement"
          value={formData.information_variant_patient_data.geolocalisation?.description || ''}
          onChange={handleGeolocalisationChange('description')}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.information_variant_patient_data.accident_de_masse || false}
              onChange={handleChange('information_variant_patient_data', 'accident_de_masse')}
            />
          }
          label="Accident de masse"
        />
      </Grid>
    </Grid>
  );
};

InformationsVariantesPatient.propTypes = {
  formData: PropTypes.shape({
    information_variant_patient_data: PropTypes.shape({
      mode_arrivee: PropTypes.string,
      autre_mode_arrivee: PropTypes.string,
      nombre_frequentations_medicales: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      motif_consultation: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      classification_profession: PropTypes.string,
      profession_specifique: PropTypes.string,
      domicile: PropTypes.string,
      residence_secondaire: PropTypes.string,
      lieu_accident: PropTypes.string,
      geolocalisation: PropTypes.shape({
        latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
        longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
        description: PropTypes.string
      }),
      accident_de_masse: PropTypes.bool
    }).isRequired
  }).isRequired,
  AdapterDateFns: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired
};
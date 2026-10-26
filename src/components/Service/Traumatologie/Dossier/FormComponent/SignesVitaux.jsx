import { useState } from 'react';
import { Grid, FormControlLabel, Checkbox, TextField, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices'; // Assurez-vous que le chemin est correct
import { useCallback } from 'react';

export const SignesVitaux = ({ formData, handleChange, setError }) => {
  const [administrationOxygeneChoices, setAdministrationOxygeneChoices] = useState([
    { value: 'aucune', label: 'Aucune' },
    { value: 'masque', label: 'Masque à oxygène' },
    { value: 'canule', label: 'Canule nasale' },
    { value: 'autre', label: 'Autre' }
  ]);

  // Charger les choix dynamiquement depuis l'API (optionnel)
  // useEffect(() => {
  //   const fetchChoices = async () => {
  //     try {
  //       const choices = await apiTogetAll('administration-oxygene-choices'); // Supposons un endpoint
  //       setAdministrationOxygeneChoices(choices);
  //     } catch (error) {
  //       console.error("Erreur lors de la récupération des choix d'administration d'oxygène:", error);
  //     }
  //   };
  //   fetchChoices();
  // }, []);

  // Gérer les changements pour les champs numériques (convertir chaînes vides en null)
  const handleNumericChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    // if (value !== null) {
    //   if (field === 'saturation_oxygene' && (value < 0 || value > 100)) {
    //     setError('La saturation en oxygène doit être entre 0 et 100 %.');
    //     return;
    //   }
    //   if (field === 'frequence_cardiaque' && (value < 30 || value > 200)) {
    //     setError('La fréquence cardiaque doit être entre 30 et 200 BPM.');
    //     return;
    //   }
    //   if (field === 'frequence_respiratoire' && (value < 12 || value > 60)) {
    //     setError('La fréquence respiratoire doit être entre 12 et 60 respirations par minute.');
    //     return;
    //   }
    //   if (field === 'pression_arterielle_systolique' && (value < 60 || value > 200)) {
    //     setError('La pression systolique doit être entre 60 et 200 mmHg.');
    //     return;
    //   }
    //   if (field === 'pression_arterielle_diastolique' && (value < 40 || value > 120)) {
    //     setError('La pression diastolique doit être entre 40 et 120 mmHg.');
    //     return;
    //   }
    // }
    handleChange('signes_vitaux_data', field)(value);
  }, [handleChange, setError]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.signes_vitaux_data?.signes_de_vie || false}
              onChange={(e) => {
                handleChange('signes_vitaux_data', 'signes_de_vie')(e.target.checked);
                if (!e.target.checked) {
                  handleChange('signes_vitaux_data', 'pression_arterielle_systolique')(null);
                  handleChange('signes_vitaux_data', 'pression_arterielle_diastolique')(null);
                  handleChange('signes_vitaux_data', 'frequence_cardiaque')(null);
                  handleChange('signes_vitaux_data', 'saturation_oxygene')(null);
                  handleChange('signes_vitaux_data', 'frequence_respiratoire')(null);
                }
              }}
            />
          }
          label="Signes de vie"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Pression artérielle systolique (mmHg)"
          placeholder='Ex: de 60 à 200'
          type="number"
          value={formData.signes_vitaux_data?.pression_arterielle_systolique || ''}
          onChange={handleNumericChange('pression_arterielle_systolique')}
          inputProps={{ min: 0 }}
          error={formData.signes_vitaux_data?.pression_arterielle_systolique && (formData.signes_vitaux_data.pression_arterielle_systolique < 60 || formData.signes_vitaux_data.pression_arterielle_systolique > 200)}
          helperText={formData.signes_vitaux_data?.pression_arterielle_systolique && (formData.signes_vitaux_data.pression_arterielle_systolique < 60 || formData.signes_vitaux_data.pression_arterielle_systolique > 200) ? "La pression systolique doit être entre 60 et 200 mmHg" : ""}
          disabled={!formData.signes_vitaux_data?.signes_de_vie}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Pression artérielle diastolique (mmHg)"
          placeholder='Ex: de 40 à 120'
          type="number"
          value={formData.signes_vitaux_data?.pression_arterielle_diastolique || ''}
          onChange={handleNumericChange('pression_arterielle_diastolique')}
          inputProps={{ min: 0 }}
          error={formData.signes_vitaux_data?.pression_arterielle_diastolique && (formData.signes_vitaux_data.pression_arterielle_diastolique < 40 || formData.signes_vitaux_data.pression_arterielle_diastolique > 120)}
          helperText={formData.signes_vitaux_data?.pression_arterielle_diastolique && (formData.signes_vitaux_data.pression_arterielle_diastolique < 40 || formData.signes_vitaux_data.pression_arterielle_diastolique > 120) ? "La pression diastolique doit être entre 40 et 120 mmHg" : ""}
          disabled={!formData.signes_vitaux_data?.signes_de_vie}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Fréquence cardiaque (BPM)"
          placeholder='Ex: de 30 à 200'
          type="number"
          value={formData.signes_vitaux_data?.frequence_cardiaque || ''}
          onChange={handleNumericChange('frequence_cardiaque')}
          inputProps={{ min: 0, 'aria-describedby': 'frequence-cardiaque-error' }}
          error={formData.signes_vitaux_data?.frequence_cardiaque && (formData.signes_vitaux_data.frequence_cardiaque < 30 || formData.signes_vitaux_data.frequence_cardiaque > 200)}
          helperText={formData.signes_vitaux_data?.frequence_cardiaque && (formData.signes_vitaux_data.frequence_cardiaque < 30 || formData.signes_vitaux_data.frequence_cardiaque > 200) ? "La fréquence cardiaque doit être entre 30 et 200 BPM" : ""}
          disabled={!formData.signes_vitaux_data?.signes_de_vie}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Saturation en oxygène (%)"
          placeholder='Ex: de 0 à 100'
          type="number"
          value={formData.signes_vitaux_data?.saturation_oxygene || ''}
          onChange={handleNumericChange('saturation_oxygene')}
          inputProps={{ min: 0, max: 100, 'aria-describedby': 'saturation-error' }}
          error={formData.signes_vitaux_data?.saturation_oxygene && (formData.signes_vitaux_data.saturation_oxygene < 0 || formData.signes_vitaux_data.saturation_oxygene > 100)}
          helperText={formData.signes_vitaux_data?.saturation_oxygene && (formData.signes_vitaux_data.saturation_oxygene < 0 || formData.signes_vitaux_data.saturation_oxygene > 100) ? "La saturation doit être entre 0 et 100" : ""}
          disabled={!formData.signes_vitaux_data?.signes_de_vie}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="administration-oxygene-label">Administration d'oxygène</InputLabel>
          <Select
            labelId="administration-oxygene-label"
            value={formData.signes_vitaux_data?.administration_oxygene || ''}
            onChange={handleChange('signes_vitaux_data', 'administration_oxygene')}
            label="Administration d'oxygène"
            disabled={!formData.signes_vitaux_data?.signes_de_vie}
          >
            {administrationOxygeneChoices.map(choice => (
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
          label="Fréquence respiratoire"
          placeholder='Ex: de 12 à 60'
          type="number"
          value={formData.signes_vitaux_data?.frequence_respiratoire || ''}
          onChange={handleNumericChange('frequence_respiratoire')}
          inputProps={{ min: 0 }}
          error={formData.signes_vitaux_data?.frequence_respiratoire && (formData.signes_vitaux_data.frequence_respiratoire < 12 || formData.signes_vitaux_data.frequence_respiratoire > 60)}
          helperText={formData.signes_vitaux_data?.frequence_respiratoire && (formData.signes_vitaux_data.frequence_respiratoire < 12 || formData.signes_vitaux_data.frequence_respiratoire > 60) ? "La fréquence respiratoire doit être entre 12 et 60" : ""}
          disabled={!formData.signes_vitaux_data?.signes_de_vie}
        />
      </Grid>
    </Grid>
  );
};

SignesVitaux.propTypes = {
  formData: PropTypes.shape({
    signes_vitaux_data: PropTypes.shape({
      signes_de_vie: PropTypes.bool,
      pression_arterielle_systolique: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      pression_arterielle_diastolique: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      frequence_cardiaque: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      saturation_oxygene: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      administration_oxygene: PropTypes.string,
      frequence_respiratoire: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
import { use, useCallback, useEffect, useState } from 'react';
import { Grid, FormControlLabel, Checkbox, TextField } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetById } from '../../../../../utils/ApiServices';

export const HistoriqueMedical = ({ formData, handleChange, setError, editingDossier, patient }) => {
  const [thisPatient, setThisPatient] = useState([])
  const handleNumericChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    if (value !== null) {
      if (value < 0) {
        setError('Le nombre de comorbidités doit être positif ou nul.');
        return;
      }
      if (value > 20) {
        setError('Le nombre de comorbidités ne peut pas dépasser 20.');
        return;
      }
    }
    handleChange('historique_medical_data', field)(value);
  }, [handleChange, setError]);


  const fetchPatientData = useCallback(async () => {
    try {
      const id = patient.id ?? editingDossier.patient_id;
      const response = await apiTogetById(`patient/`, id);
      setThisPatient(response);
    } catch (error) {
      setError('Erreur lors de la récupération des données du patient.');
    }
  }, [editingDossier, setError]);
  useEffect(() => {
    fetchPatientData();
  }, [fetchPatientData]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Nombre de comorbidités"
          placeholder='Ex: Nombre positif'
          type="number"
          value={formData.historique_medical_data?.nombre_comorbidites || ''}
          onChange={handleNumericChange('nombre_comorbidites')}
          inputProps={{ min: 0, 'aria-describedby': 'nombre-comorbidites-error' }}
          error={formData.historique_medical_data?.nombre_comorbidites && formData.historique_medical_data.nombre_comorbidites < 0}
          helperText={formData.historique_medical_data?.nombre_comorbidites && formData.historique_medical_data.nombre_comorbidites < 0 ? "Le nombre de comorbidités doit être positif ou nul" : ""}
        />
      </Grid>
      {thisPatient.genre === 'Femme' && (
        <Grid size={{ xs: 12 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={formData.historique_medical_data?.patiente_enceinte || false}
                onChange={handleChange('historique_medical_data', 'patiente_enceinte')}
              />
            }
            label="Patiente enceinte"
          />
        </Grid>
      )}
    </Grid>
  );
};

HistoriqueMedical.propTypes = {
  formData: PropTypes.shape({
    historique_medical_data: PropTypes.shape({
      nombre_comorbidites: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      patiente_enceinte: PropTypes.bool
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  editingDossier: PropTypes.shape({
    patient_id: PropTypes.string.isRequired
  }).isRequired,
  patient: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  setError: PropTypes.func
};
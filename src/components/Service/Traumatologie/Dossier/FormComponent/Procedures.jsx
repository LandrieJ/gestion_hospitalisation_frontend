import { useState, useEffect, useCallback } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';

export const Procedures = ({ formData, handleChange, setError }) => {
  const [procedureList, setProcedureList] = useState([]);

  useEffect(() => {
    const fetchProcedureTypes = async () => {
      try {
        const types = await apiTogetAll('traumatologie/procedure-types');
        setProcedureList(types.results || []);
      } catch (error) {
        setError('Impossible de charger les types de procédures.');
      }
    };
    fetchProcedureTypes();
  }, [setError]);

  const handleCheckboxArrayChange = useCallback((field, value) => (event) => {
    let currentArray = formData.interventions_urgences_procedures_data?.[field] || [];
    if (event.target.checked) {
      currentArray = [...currentArray, value];
    } else {
      currentArray = currentArray.filter(item => item !== value);
    }
    if (currentArray.length === 0 && formData.interventions_urgences_procedures_data?.procedures) {
      setError('Au moins une procédure doit être sélectionnée.');
      return;
    }
    handleChange('interventions_urgences_procedures_data', field)({
      target: { value: currentArray.length > 0 ? currentArray : null }
    });
  }, [formData.interventions_urgences_procedures_data, handleChange, setError]);

  const handleTextChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    handleChange('interventions_urgences_procedures_data', field)({ target: { value } });
  }, [handleChange]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.interventions_urgences_procedures_data?.procedures || false}
              onChange={handleChange('interventions_urgences_procedures_data', 'procedures')}
              aria-label="Procédures effectuées"
            />
          }
          label="Procédures effectuées"
        />
      </Grid>
      {formData.interventions_urgences_procedures_data?.procedures && (
        <>
          <Grid size={{ xs: 12 }}>
            <Typography variant="h6" gutterBottom>
              Types de procédures
            </Typography>
            {formData.interventions_urgences_procedures_data?.procedures && !formData.interventions_urgences_procedures_data?.procedures_types && (
              <Typography variant="caption" color="error">Au moins une procédure doit être sélectionnée</Typography>
            )}
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormGroup>
              {procedureList.map((procedure) => (
                <FormControlLabel
                  key={procedure.id}
                  control={
                    <Checkbox
                      checked={formData.interventions_urgences_procedures_data?.procedures_types?.includes(procedure.id) || false}
                      onChange={handleCheckboxArrayChange('procedures_types', procedure.id)}
                      aria-label={procedure.nom}
                    />
                  }
                  label={procedure.nom}
                />
              ))}
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Autre procédure (précisez)"
              value={formData.interventions_urgences_procedures_data?.procedures_autre || ''}
              onChange={handleTextChange('procedures_autre')}
              aria-describedby="procedures-autre-error"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

Procedures.propTypes = {
  formData: PropTypes.shape({
    interventions_urgences_procedures_data: PropTypes.shape({
      procedures: PropTypes.bool,
      procedures_types: PropTypes.arrayOf(PropTypes.number, PropTypes.oneOf([null])),
      procedures_autre: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
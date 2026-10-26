import { useState, useEffect, useCallback } from 'react';
import { Checkbox, FormControlLabel, FormGroup, Grid, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';

export const TestsDiagnostiques = ({ formData, handleChange, setError }) => {
  const [diagnosticTestList, setDiagnosticTestList] = useState([]);

  useEffect(() => {
    const fetchDiagnosticTestTypes = async () => {
      try {
        const types = await apiTogetAll('traumatologie/diagnostic-test-types');
        setDiagnosticTestList(types.results || []);
      } catch (error) {
        setError('Impossible de charger les types de tests diagnostiques.');
      }
    };
    fetchDiagnosticTestTypes();
  }, [setError]);

  const handleCheckboxArrayChange = useCallback((field, value) => (event) => {
    let currentArray = formData.interventions_urgences_tests_diagnostiques_data?.[field] || [];
    if (event.target.checked) {
      currentArray = [...currentArray, value];
    } else {
      currentArray = currentArray.filter(item => item !== value);
    }
    if (currentArray.length === 0 && formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques) {
      setError('Au moins un test diagnostique doit être sélectionné.');
      return;
    }
    handleChange('interventions_urgences_tests_diagnostiques_data', field)({
      target: { value: currentArray.length > 0 ? currentArray : null }
    });
  }, [formData.interventions_urgences_tests_diagnostiques_data, handleChange, setError]);

  const handleTextChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    handleChange('interventions_urgences_tests_diagnostiques_data', field)({ target: { value } });
  }, [handleChange]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques || false}
              onChange={handleChange('interventions_urgences_tests_diagnostiques_data', 'tests_diagnostiques')}
              aria-label="Tests diagnostiques effectués"
            />
          }
          label="Tests diagnostiques effectués"
        />
      </Grid>
      {formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques && (
        <>
          <Grid size={{ xs: 12 }}>
            <FormGroup>
              {diagnosticTestList.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Aucun test diagnostique disponible.
                </Typography>
              ) : (
                diagnosticTestList.map((test) => (
                  <FormControlLabel
                    key={test.id}
                    control={
                      <Checkbox
                        checked={formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques_types?.includes(test.id) || false}
                        onChange={handleCheckboxArrayChange('tests_diagnostiques_types', test.id)}
                        aria-label={test.nom}
                      />
                    }
                    label={test.nom}
                  />
                ))
              )}
              {formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques && !formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques_types && (
                <Typography variant="caption" color="error">Au moins un test diagnostique doit être sélectionné</Typography>
              )}
            </FormGroup>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Autre test diagnostique (précisez)"
              value={formData.interventions_urgences_tests_diagnostiques_data?.tests_diagnostiques_autre || ''}
              onChange={handleTextChange('tests_diagnostiques_autre')}
              aria-describedby="tests-diagnostiques-autre-error"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

TestsDiagnostiques.propTypes = {
  formData: PropTypes.shape({
    interventions_urgences_tests_diagnostiques_data: PropTypes.shape({
      tests_diagnostiques: PropTypes.bool,
      tests_diagnostiques_types: PropTypes.arrayOf(PropTypes.number, PropTypes.oneOf([null])),
      tests_diagnostiques_autre: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
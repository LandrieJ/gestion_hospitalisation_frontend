import { useState, useEffect, useCallback } from 'react';
import { Checkbox, FormControlLabel, FormGroup, FormLabel, Grid, TextField, Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';

export const MedicamentsLiquides = ({ formData, setError, handleChange }) => {
  const [medicamentTypesData, setMedicamentTypesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMedicamentTypesData = async () => {
      try {
        setIsLoading(true);
        const typesData = await apiTogetAll('traumatologie/medicament-types');
        setMedicamentTypesData(typesData.results || []);
      } catch (error) {
        setError(error.response?.data?.msg || 'Erreur lors de la récupération des types de médicaments.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicamentTypesData();
  }, [setError]);

  const handleMedicamentTypeChangeHandler = useCallback((typeId) => (event) => {
    const currentSelectedTypesList = formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_types || [];
    let updatedTypesList;
    if (event.target.checked) {
      updatedTypesList = [...currentSelectedTypesList, typeId];
    } else {
      updatedTypesList = currentSelectedTypesList.filter(id => id !== typeId);
    }
    if (updatedTypesList.length === 0 && formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_administres) {
      setError('Au moins un type de médicament/liquide doit être sélectionné.');
      return;
    }
    handleChange('interventions_urgences_medicaments_liquide_data', 'medicaments_liquide_types')(updatedTypesList);
  }, [formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_types, formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_administres, handleChange, setError]);

  const handleTextChangeHandler = useCallback((field) => (event) => {
    const valueData = event.target.value === '' ? null : event.target.value;
    handleChange('interventions_urgences_medicaments_liquide_data', field)(valueData);
  }, [handleChange]);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_administres || false}
              onChange={handleChange('interventions_urgences_medicaments_liquide_data', 'medicaments_liquide_administres')}
              disabled={isLoading}
              aria-label="Médicaments ou liquides administrés"
            />
          }
          label="Médicaments/Liquides administrés"
        />
      </Grid>
      {formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_administres && (
        <>
          <Grid size={{ xs: 12 }}>
            <FormLabel component="legend">Types de médicaments/liquides</FormLabel>
            <FormGroup>
              {medicamentTypesData.length === 0 ? (
                <Typography variant="caption" color="text.secondary">
                  Aucun type de médicament disponible.
                </Typography>
              ) : (
                medicamentTypesData.map((type) => (
                  <FormControlLabel
                    key={type.id}
                    control={
                      <Checkbox
                        checked={formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_types?.includes(type.id) || false}
                        onChange={handleMedicamentTypeChangeHandler(type.id)}
                        disabled={isLoading}
                        aria-label={`Type de médicament ${type.nom_medicament}`}
                      />
                    }
                    label={type.nom_medicament}
                  />
                ))
              )}
            </FormGroup>
            {formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_administres && !formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_types?.length && (
              <Typography variant="caption" color="error">Au moins un type doit être sélectionné</Typography>
            )}
            <TextField
              fullWidth
              margin="normal"
              label="Autre (précisez)"
              value={formData.interventions_urgences_medicaments_liquide_data?.medicaments_liquide_autre || ''}
              onChange={handleTextChangeHandler('medicaments_liquide_autre')}
              disabled={isLoading}
              aria-describedby="medicaments-liquide-autre-error"
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

MedicamentsLiquides.propTypes = {
  formData: PropTypes.shape({
    interventions_urgences_medicaments_liquide_data: PropTypes.shape({
      medicaments_liquide_administres: PropTypes.bool,
      medicaments_liquide_types: PropTypes.arrayOf(PropTypes.number),
      medicaments_liquide_autre: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])])
    }).isRequired
  }).isRequired,
  setError: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired
};
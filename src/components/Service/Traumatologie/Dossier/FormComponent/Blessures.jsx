import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Checkbox, FormControl, FormControlLabel,
  InputLabel, MenuItem, Select, Typography, Chip, OutlinedInput,
  IconButton, Grid
} from '@mui/material';
import { AddCircleOutline, RemoveCircleOutline } from '@mui/icons-material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';

export const Blessures = ({ formData, handleChange, setError }) => {
  const [localisationsData, setLocalisationsData] = useState([]);
  const [conditionsData, setConditionsData] = useState([]);
  const [injuries, setInjuries] = useState([]);

  useEffect(() => {
    const fetchAllLookupData = async () => {
      try {
        const [localisations, conditions] = await Promise.all([
          apiTogetAll('traumatologie/localisation-types'),
          apiTogetAll('traumatologie/condition-types')
        ]);
        setLocalisationsData(localisations.results);
        setConditionsData(conditions.results);
      } catch (error) {
        setError('Impossible de charger les options des blessures.');
      }
    };
    fetchAllLookupData();
  }, [setError]);

  useEffect(() => {
    if (formData.blessures_data?.details && localisationsData.length > 0 && conditionsData.length > 0) {
      const initialInjuries = formData.blessures_data.details.map(detail => ({
        localisation: localisationsData.find(loc => loc.id === detail.localisation)?.nom || '',
        conditions: (detail.conditions || []).map(condId =>
          conditionsData.find(cond => cond.id === condId)?.nom || ''
        ).filter(Boolean)
      }));
      setInjuries(initialInjuries);
    } else {
      setInjuries([]);
    }
  }, [formData.blessures_data?.details, localisationsData, conditionsData]);

  const handleInjuryChange = useCallback((index, field, value) => {
    if (field === 'localisation' && value) {
      const isDuplicate = injuries.some((injury, i) => i !== index && injury.localisation === value);
      if (isDuplicate) {
        setError('Localisation déjà sélectionnée.');
        return;
      }
    }

    const updatedInjuries = injuries.map((injury, i) =>
      i === index ? { ...injury, [field]: value } : injury
    );

    setInjuries(updatedInjuries);

    const dataForApi = updatedInjuries.map(injury => ({
      localisation: localisationsData.find(loc => loc.nom === injury.localisation)?.id || null,
      conditions: injury.conditions
        .map(condName => conditionsData.find(cond => cond.nom === condName)?.id)
        .filter(Boolean)
    }));

    handleChange('blessures_data', 'details')(dataForApi);

    if (field === 'localisation' && !value) {
      setError('La localisation anatomique est requise pour chaque blessure.');
    }
  }, [injuries, localisationsData, conditionsData, handleChange, setError]);

  const handleAddInjuryField = useCallback(() => {
    setInjuries(prevInjuries => {
      const newInjury = { localisation: '', conditions: [] };
      const updatedInjuries = [...prevInjuries, newInjury];
      const dataForApi = updatedInjuries.map(injury => ({
        localisation: localisationsData.find(loc => loc.nom === injury.localisation)?.id || null,
        conditions: injury.conditions
          .map(condName => conditionsData.find(cond => cond.nom === condName)?.id)
          .filter(Boolean)
      }));
      handleChange('blessures_data', 'details')(dataForApi);
      return updatedInjuries;
    });
  }, [localisationsData, conditionsData, handleChange]);

  const handleRemoveInjuryField = useCallback((index) => {
    setInjuries(prevInjuries => {
      const updatedInjuries = prevInjuries.filter((_, i) => i !== index);
      const dataForApi = updatedInjuries.map(injury => ({
        localisation: localisationsData.find(loc => loc.nom === injury.localisation)?.id || null,
        conditions: injury.conditions
          .map(condName => conditionsData.find(cond => cond.nom === condName)?.id)
          .filter(Boolean)
      }));
      handleChange('blessures_data', 'details')(dataForApi);
      return updatedInjuries;
    });
  }, [localisationsData, conditionsData, handleChange]);

  const handleCheckboxChange = useCallback((field) => (event) => {
    handleChange('blessures_data', field)(event.target.checked);
  }, [handleChange]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <Button
          variant="outlined"
          onClick={handleAddInjuryField}
          startIcon={<AddCircleOutline />}
          sx={{ mb: 2 }}
        >
          Ajouter une nouvelle blessure
        </Button>
      </Grid>

      <Grid size={{ xs: 12 }}>
        {injuries.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Aucune blessure ajoutée pour le moment. Cliquez sur "Ajouter une nouvelle blessure" pour commencer.
          </Typography>
        ) : (
          injuries.map((injury, index) => (
            <Box key={index} sx={{ mb: 3, p: 2, border: '1px solid #ddd', borderRadius: '4px', position: 'relative' }}>
              <IconButton
                aria-label="supprimer blessure"
                onClick={() => handleRemoveInjuryField(index)}
                sx={{ position: 'absolute', top: 8, right: 8 }}
              >
                <RemoveCircleOutline color="error" />
              </IconButton>

              <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
                Blessure #{index + 1}
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel id={`localisation-label-${index}`}>Localisation anatomique</InputLabel>
                    <Select
                      labelId={`localisation-label-${index}`}
                      value={injury.localisation || ''}
                      onChange={(e) => handleInjuryChange(index, 'localisation', e.target.value)}
                      label="Localisation anatomique"
                      aria-describedby={`localisation-error-${index}`}
                    >
                      <MenuItem value=""><em>Aucune</em></MenuItem>
                      {localisationsData.map(loc => (
                        <MenuItem key={loc.id} value={loc.nom}>{loc.nom}</MenuItem>
                      ))}
                    </Select>
                    {!injury.localisation && (
                      <Typography variant="caption" color="error">Ce champ est requis</Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <FormControl fullWidth disabled={!injury.localisation}>
                    <InputLabel id={`conditions-label-${index}`}>Conditions</InputLabel>
                    <Select
                      labelId={`conditions-label-${index}`}
                      multiple
                      value={injury.conditions || []}
                      onChange={(e) => handleInjuryChange(index, 'conditions', e.target.value)}
                      input={<OutlinedInput id={`select-multiple-chip-${index}`} label="Conditions" />}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip key={value} label={value} />
                          ))}
                        </Box>
                      )}
                      aria-describedby={`conditions-error-${index}`}
                    >
                      {conditionsData.map(cond => (
                        <MenuItem key={cond.id} value={cond.nom}>{cond.nom}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          ))
        )}
      </Grid>

      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.blessures_data?.checklist_trauma_utilisee || false}
              onChange={handleCheckboxChange('checklist_trauma_utilisee')}
            />
          }
          label="Checklist trauma utilisée"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.blessures_data?.blessure_supplementaire || false}
              onChange={handleCheckboxChange('blessure_supplementaire')}
            />
          }
          label="Blessure supplémentaire"
        />
      </Grid>
    </Grid>
  );
};

Blessures.propTypes = {
  formData: PropTypes.shape({
    blessures_data: PropTypes.shape({
      details: PropTypes.arrayOf(
        PropTypes.shape({
          localisation: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
          conditions: PropTypes.arrayOf(PropTypes.number)
        })
      ),
      checklist_trauma_utilisee: PropTypes.bool,
      blessure_supplementaire: PropTypes.bool
    })
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
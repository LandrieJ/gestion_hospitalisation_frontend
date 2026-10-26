import { useEffect, useCallback } from 'react';
import { Grid, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';
import { useState } from 'react';

export const Triage = ({ formData, handleChange, setError }) => {
  const [outilTriageChoices, setOutilTriageChoices] = useState([
    { value: 'ESI', label: 'ESI (Emergency Severity Index)' },
    { value: 'CIMU', label: 'CIMU (Classification Infirmière des Malades aux Urgences)' },
    { value: 'FRENCH', label: 'FRENCH' },
    { value: 'autre', label: 'Autre' }
  ]);

  // useEffect(() => {
  //   const fetchChoices = async () => {
  //     try {
  //       const choices = await apiTogetAll('outil-triage-choices');
  //       setOutilTriageChoices(choices);
  //     } catch (error) {
  //       setError('Impossible de charger les options du formulaire.');
  //     }
  //   };
  //   fetchChoices();
  // }, [setError]);

  useEffect(() => {
    if (!formData.triage_data?.triage_effectue) {
      handleChange('triage_data', 'outil_triage')(null);
      handleChange('triage_data', 'autre_outil_triage')(null);
      handleChange('triage_data', 'autre_categorie_outil_triage')(null);
    }
  }, [formData.triage_data?.triage_effectue, handleChange]);

  const handleTextChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    if (field === 'autre_outil_triage' && formData.triage_data?.outil_triage === 'autre' && !value) {
      setError("Préciser l'outil de triage est requis lorsque 'Autre' est sélectionné.");
      return;
    }
    handleChange('triage_data', field)(value);
  }, [handleChange, formData.triage_data?.outil_triage, setError]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.triage_data?.triage_effectue || false}
              onChange={handleChange('triage_data', 'triage_effectue')}
            />
          }
          label="Triage effectué"
        />
      </Grid>
      {formData.triage_data?.triage_effectue && (
        <>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel id="outil-triage-label">Outil de triage</InputLabel>
              <Select
                labelId="outil-triage-label"
                value={formData.triage_data?.outil_triage || ''}
                onChange={handleChange('triage_data', 'outil_triage')}
                label="Outil de triage"
                aria-describedby="outil-triage-error"
              >
                <MenuItem value=""><em>Aucun</em></MenuItem>
                {outilTriageChoices.map(choice => (
                  <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
                ))}
              </Select>
              {formData.triage_data?.triage_effectue && !formData.triage_data?.outil_triage && (
                <Typography variant="caption" color="error">Ce champ est requis</Typography>
              )}
            </FormControl>
          </Grid>
          {formData.triage_data?.outil_triage === 'autre' && (
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                margin="normal"
                label="Préciser l'outil de triage"
                value={formData.triage_data?.autre_outil_triage || ''}
                onChange={handleTextChange('autre_outil_triage')}
                aria-describedby="autre-outil-triage-error"
              />
              {formData.triage_data?.outil_triage === 'autre' && !formData.triage_data?.autre_outil_triage && (
                <Typography variant="caption" color="error">Ce champ est requis</Typography>
              )}
            </Grid>
          )}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              margin="normal"
              label="Autre catégorie d'outil de triage"
              value={formData.triage_data?.autre_categorie_outil_triage || ''}
              onChange={handleTextChange('autre_categorie_outil_triage')}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
};

Triage.propTypes = {
  formData: PropTypes.shape({
    triage_data: PropTypes.shape({
      triage_effectue: PropTypes.bool,
      outil_triage: PropTypes.string,
      autre_outil_triage: PropTypes.string,
      autre_categorie_outil_triage: PropTypes.string
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
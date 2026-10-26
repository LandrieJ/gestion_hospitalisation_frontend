import { useEffect, useCallback } from 'react';
import { Grid, FormControl, FormControlLabel, Checkbox, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll } from '../../../../../utils/ApiServices';
import { useState } from 'react';

export const EvaluationABCDE = ({ formData, handleChange, setError }) => {
  const [evdaChoices, setEvdaChoices] = useState([
    { value: 'A', label: 'A - Alerte' },
    { value: 'V', label: 'V - Réponse verbale' },
    { value: 'D', label: 'D - Réponse à la douleur' },
    { value: 'U', label: 'U - Sans réponse' }
  ]);
  const [pupillaireChoices, setPupillaireChoices] = useState([
    { value: 0, label: '0 - Aucune' },
    { value: 1, label: '1 - Une seule pupille' },
    { value: 2, label: '2 - Les deux pupilles' }
  ]);

//   useEffect(() => {
//     const fetchChoices = async () => {
//       try {
//         const [evdaData, pupillaireData] = await Promise.all([
//           apiTogetAll('evda-choices'),
//           apiTogetAll('pupillaire-choices')
//         ]);
//         setEvdaChoices(evdaData);
//         setPupillaireChoices(pupillaireData);
//       } catch (error) {
//         setError('Impossible de charger les options du formulaire.');
//       }
//     };
//     fetchChoices();
//   }, [setError]);

  useEffect(() => {
    const { score_glasgow_yeux, score_glasgow_verbal, score_glasgow_motricite } = formData.evaluation_abcde_data;
    const total = (score_glasgow_yeux || 0) + (score_glasgow_verbal || 0) + (score_glasgow_motricite || 0);
    if (total < 3 || total > 15) {
      handleChange('evaluation_abcde_data', 'score_glasgow_total')(null);
    } else {
      handleChange('evaluation_abcde_data', 'score_glasgow_total')(total || null);
    }
  }, [
    formData.evaluation_abcde_data.score_glasgow_yeux,
    formData.evaluation_abcde_data.score_glasgow_verbal,
    formData.evaluation_abcde_data.score_glasgow_motricite,
  ]);

  const handleNumericChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : Number(event.target.value);
    if (value !== null) {
      if (field === 'score_glasgow_yeux' && (value < 1 || value > 4)) {
        setError('Le score des yeux doit être entre 1 et 4.');
        return;
      }
      if (field === 'score_glasgow_verbal' && (value < 1 || value > 5)) {
        setError('Le score verbal doit être entre 1 et 5.');
        return;
      }
      if (field === 'score_glasgow_motricite' && (value < 1 || value > 6)) {
        setError('Le score motricité doit être entre 1 et 6.');
        return;
      }
      if (field === 'nombre_reaction_pupillaire' && (value < 0 || value > 2)) {
        setError('La réaction pupillaire doit être entre 0 et 2.');
        return;
      }
    }
    handleChange('evaluation_abcde_data', field)(value);
  }, [handleChange, setError]);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="evda-initiale-label">EVDA Initiale</InputLabel>
          <Select
            labelId="evda-initiale-label"
            value={formData.evaluation_abcde_data?.evda_initiale || ''}
            onChange={handleChange('evaluation_abcde_data', 'evda_initiale')}
            label="EVDA Initiale"
            aria-describedby="evda-initiale-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {evdaChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Typography variant="h6" gutterBottom>Score de Glasgow</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="score-glasgow-yeux-label">Ouverture des yeux</InputLabel>
          <Select
            labelId="score-glasgow-yeux-label"
            value={formData.evaluation_abcde_data?.score_glasgow_yeux || ''}
            onChange={handleNumericChange('score_glasgow_yeux')}
            label="Ouverture des yeux"
            error={formData.evaluation_abcde_data?.score_glasgow_yeux && (formData.evaluation_abcde_data.score_glasgow_yeux < 1 || formData.evaluation_abcde_data.score_glasgow_yeux > 4)}
            aria-describedby="score-glasgow-yeux-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            <MenuItem value={1}>1 - Aucune</MenuItem>
            <MenuItem value={2}>2 - À la douleur</MenuItem>
            <MenuItem value={3}>3 - À la demande</MenuItem>
            <MenuItem value={4}>4 - Spontanée</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="score-glasgow-verbal-label">Réponse verbale</InputLabel>
          <Select
            labelId="score-glasgow-verbal-label"
            value={formData.evaluation_abcde_data?.score_glasgow_verbal || ''}
            onChange={handleNumericChange('score_glasgow_verbal')}
            label="Réponse verbale"
            error={formData.evaluation_abcde_data?.score_glasgow_verbal && (formData.evaluation_abcde_data.score_glasgow_verbal < 1 || formData.evaluation_abcde_data.score_glasgow_verbal > 5)}
            aria-describedby="score-glasgow-verbal-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            <MenuItem value={1}>1 - Aucune</MenuItem>
            <MenuItem value={2}>2 - Incompréhensible</MenuItem>
            <MenuItem value={3}>3 - Inappropriée</MenuItem>
            <MenuItem value={4}>4 - Confuse</MenuItem>
            <MenuItem value={5}>5 - Normale</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="score-glasgow-motricite-label">Réponse motrice</InputLabel>
          <Select
            labelId="score-glasgow-motricite-label"
            value={formData.evaluation_abcde_data?.score_glasgow_motricite || ''}
            onChange={handleNumericChange('score_glasgow_motricite')}
            label="Réponse motrice"
            error={formData.evaluation_abcde_data?.score_glasgow_motricite && (formData.evaluation_abcde_data.score_glasgow_motricite < 1 || formData.evaluation_abcde_data.score_glasgow_motricite > 6)}
            aria-describedby="score-glasgow-motricite-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            <MenuItem value={1}>1 - Aucune</MenuItem>
            <MenuItem value={2}>2 - Extension à la douleur</MenuItem>
            <MenuItem value={3}>3 - Flexion à la douleur</MenuItem>
            <MenuItem value={4}>4 - Évitement</MenuItem>
            <MenuItem value={5}>5 - Orientée</MenuItem>
            <MenuItem value={6}>6 - Aux ordres</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Score de Glasgow Total"
          type="number"
          value={formData.evaluation_abcde_data?.score_glasgow_total || ''}
          InputProps={{ readOnly: true }}
          helperText="Calculé automatiquement comme la somme des scores Yeux + Verbal + Motricité"
          aria-readonly="true"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={formData.evaluation_abcde_data?.glasgow_qualifie || false}
              onChange={handleChange('evaluation_abcde_data', 'glasgow_qualifie')}
            />
          }
          label="Score de Glasgow qualifié"
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="nombre-reaction-pupillaire-label">Nombre de réaction pupillaire</InputLabel>
          <Select
            labelId="nombre-reaction-pupillaire-label"
            value={formData.evaluation_abcde_data?.nombre_reaction_pupillaire || ''}
            onChange={handleNumericChange('nombre_reaction_pupillaire')}
            label="Nombre de réaction pupillaire"
            error={formData.evaluation_abcde_data?.nombre_reaction_pupillaire && (formData.evaluation_abcde_data.nombre_reaction_pupillaire < 0 || formData.evaluation_abcde_data.nombre_reaction_pupillaire > 2)}
            aria-describedby="nombre-reaction-pupillaire-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {pupillaireChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

EvaluationABCDE.propTypes = {
  formData: PropTypes.shape({
    evaluation_abcde_data: PropTypes.shape({
      evda_initiale: PropTypes.string,
      score_glasgow_yeux: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      score_glasgow_verbal: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      score_glasgow_motricite: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      score_glasgow_total: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
      glasgow_qualifie: PropTypes.bool,
      nombre_reaction_pupillaire: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])])
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  setError: PropTypes.func
};
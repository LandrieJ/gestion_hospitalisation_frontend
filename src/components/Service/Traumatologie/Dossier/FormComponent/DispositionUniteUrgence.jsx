import { useState, useEffect, useCallback } from 'react';
import { FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { apiTogetAll, apiToPatch } from '../../../../../utils/ApiServices';
import { useContext } from 'react';
import { UserContext } from '../../../../../utils/UserContext';

export const DispositionUniteUrgence = ({ formData, AdapterDateFns, handleChange, handleDateChange, setError }) => {
  const { user, setUser } = useContext(UserContext);
  const [sortieSuChoices] = useState([
    { value: 'domicile', label: 'Retour à domicile' },
    { value: 'hospitalisation', label: 'Hospitalisation' },
    { value: 'transfert', label: 'Transfert' },
    { value: 'deces', label: 'Décès' },
    { value: 'autre', label: 'Autre' }
  ]);

  const [hopitaux] = useState([
    { value: 'chu_central', label: 'CHU Central' },
    { value: 'hopital_regional', label: 'Hôpital Régional' },
    { value: 'clinique_prive', label: 'Clinique Privée' },
    { value: 'autre_hopital', label: 'Autre hôpital' }
  ]);

  const [services] = useState([
    { value: 'cardiologie', label: 'Cardiologie' },
    { value: 'neurologie', label: 'Neurologie' },
    { value: 'orthopédie', label: 'Orthopédie' },
    { value: 'chirurgie_generale', label: 'Chirurgie Générale' },
    { value: 'reanimation', label: 'Réanimation' },
    { value: 'autre_service', label: 'Autre service' }
  ]);


  useEffect(() => {
    const sortie = formData.disposition_unite_urgence_data?.sortie_su;
    const data = formData.disposition_unite_urgence_data || {};
    const fieldsToClean = [];

    if (sortie !== 'autre') {
      fieldsToClean.push('autre_sortie_su');
    }
    if (sortie !== 'hospitalisation') {
      const bedId = data.numero_chambre_lit;
      if (bedId && typeof bedId === "number") {
        (async () => {
          try {
            await apiToPatch(`services/beds/`, bedId, { is_occupied: false });
            console.log(`Lit ${bedId} libéré`);
          } catch (bedError) {
            console.error("Erreur lors de la libération du lit :", bedError);
          }
        })();
      }
      fieldsToClean.push('diagnostique_hospitalisation', 'numero_chambre_lit');
    }
    if (sortie !== 'transfert') {
      fieldsToClean.push('hopital_transfert', 'autre_hopital', 'service_transfert', 'autre_service_transfert', 'motif_transfert');
    }
    if (sortie !== 'deces') {
      fieldsToClean.push('cause_deces');
    }
    if (sortie !== 'domicile') {
      fieldsToClean.push('consignes_domicile', 'accompagnant', 'rdv_controle');
    }

    fieldsToClean.forEach(field => {
      if (data[field] !== undefined && data[field] !== null) {
        handleChange('disposition_unite_urgence_data', field)({ target: { value: null } });
      }
    });
  }, [formData.disposition_unite_urgence_data?.sortie_su, handleChange]);




  const handleTextChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    handleChange('disposition_unite_urgence_data', field)({ target: { value } });
  }, [handleChange]);

  const handleSelectChange = useCallback((field) => (event) => {
    const value = event.target.value === '' ? null : event.target.value;
    handleChange('disposition_unite_urgence_data', field)({ target: { value } });
  }, [handleChange]);

  const renderDomicileFields = () => (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Accompagnant"
          value={formData.disposition_unite_urgence_data?.accompagnant || ''}
          onChange={handleTextChange('accompagnant')}
          placeholder="Nom de l'accompagnant"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Consignes pour le domicile"
          multiline
          rows={3}
          value={formData.disposition_unite_urgence_data?.consignes_domicile || ''}
          onChange={handleTextChange('consignes_domicile')}
          placeholder="Repos, médicaments, précautions..."
        />
      </Grid>
    </>
  );

  const renderHospitalisationFields = () => (
    <>
      <Grid size={{ xs: 12, md: 3 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="numerochambrelit-label">Lits disponibles</InputLabel>
          <Select
            labelId="numerochambrelit-label"
            value={formData.disposition_unite_urgence_data?.numero_chambre_lit || ''}
            onChange={(event) => {
              const value = event.target.value ? parseInt(event.target.value, 10) : null;
              handleChange('disposition_unite_urgence_data', 'numero_chambre_lit')({ target: { value } });
            }}
            label="Lits disponibles"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {user.service.beds.filter(bed => !bed.is_occupied).map(bed => (
              <MenuItem key={bed.id} value={bed.id}>{bed.code}</MenuItem>
            ))}
          </Select>
          {!formData.disposition_unite_urgence_data?.sortie_su && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </FormControl>
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Diagnostic"
          multiline
          rows={3}
          value={formData.disposition_unite_urgence_data?.diagnostique_hospitalisation || ''}
          onChange={handleTextChange('diagnostique_hospitalisation')}
          placeholder="Diagnostic principal"
          required
        />
      </Grid>
    </>
  );

  const renderTransfertFields = () => (
    <>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="hopital-transfert-label">Hôpital de transfert</InputLabel>
          <Select
            labelId="hopital-transfert-label"
            value={formData.disposition_unite_urgence_data?.hopital_transfert || ''}
            onChange={handleSelectChange('hopital_transfert')}
            label="Hôpital de transfert"
          >
            <MenuItem value=""><em>Sélectionner un hôpital</em></MenuItem>
            {hopitaux.map(hopital => (
              <MenuItem key={hopital.value} value={hopital.value}>{hopital.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {formData.disposition_unite_urgence_data?.hopital_transfert === 'autre_hopital' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser l'hôpital"
            value={formData.disposition_unite_urgence_data?.autre_hopital || ''}
            onChange={handleTextChange('autre_hopital')}
            required
          />
        </Grid>
      )}

      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="service-transfert-label">Service de destination</InputLabel>
          <Select
            labelId="service-transfert-label"
            value={formData.disposition_unite_urgence_data?.service_transfert || ''}
            onChange={handleSelectChange('service_transfert')}
            label="Service de destination"
          >
            <MenuItem value=""><em>Sélectionner un service</em></MenuItem>
            {services.map(service => (
              <MenuItem key={service.value} value={service.value}>{service.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {formData.disposition_unite_urgence_data?.service_transfert === 'autre_service' && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Préciser le service"
            value={formData.disposition_unite_urgence_data?.autre_service_transfert || ''}
            onChange={handleTextChange('autre_service_transfert')}
            required
          />
        </Grid>
      )}

      <Grid size={{ xs: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Motif du transfert"
          multiline
          rows={3}
          value={formData.disposition_unite_urgence_data?.motif_transfert || ''}
          onChange={handleTextChange('motif_transfert')}
          placeholder="Raison du transfert vers cet établissement/service"
          required
        />
      </Grid>
    </>
  );

  const renderDecesFields = () => (
    <>
      <Grid size={{ xs: 12, md: 12 }}>
        <TextField
          fullWidth
          margin="normal"
          label="Cause du décès"
          multiline
          rows={3}
          value={formData.disposition_unite_urgence_data?.cause_deces || ''}
          onChange={handleTextChange('cause_deces')}
          placeholder="Cause principale et circonstances"
          required
        />
      </Grid>
    </>
  );

  const renderAutreFields = () => (
    <Grid size={{ xs: 12, md: 6 }}>
      <TextField
        fullWidth
        margin="normal"
        label="Préciser la sortie SU"
        value={formData.disposition_unite_urgence_data?.autre_sortie_su || ''}
        onChange={handleTextChange('autre_sortie_su')}
        required
        placeholder="Préciser le type de sortie"
      />
    </Grid>
  );

  const renderDynamicFields = () => {
    const sortie = formData.disposition_unite_urgence_data?.sortie_su;

    switch (sortie) {
      case 'domicile':
        return renderDomicileFields();
      case 'hospitalisation':
        return renderHospitalisationFields();
      case 'transfert':
        return renderTransfertFields();
      case 'deces':
        return renderDecesFields();
      case 'autre':
        return renderAutreFields();
      default:
        return null;
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <FormControl fullWidth margin="normal">
          <InputLabel id="sortie-su-label">Sortie SU</InputLabel>
          <Select
            labelId="sortie-su-label"
            value={formData.disposition_unite_urgence_data?.sortie_su || ''}
            onChange={(event) => {
              const value = event.target.value || null;
              if (!value) {
                setError('La sortie SU est requise.');
                return;
              }
              setError(null);
              handleChange('disposition_unite_urgence_data', 'sortie_su')({ target: { value } });
            }}
            label="Sortie SU"
            aria-describedby="sortie-su-error"
          >
            <MenuItem value=""><em>Aucun</em></MenuItem>
            {sortieSuChoices.map(choice => (
              <MenuItem key={choice.value} value={choice.value}>{choice.label}</MenuItem>
            ))}
          </Select>
          {!formData.disposition_unite_urgence_data?.sortie_su && (
            <Typography variant="caption" color="error">Ce champ est requis</Typography>
          )}
        </FormControl>
      </Grid>

      {/* Champs dynamiques selon la sortie sélectionnée */}
      {renderDynamicFields()}
    </Grid>
  );
};

DispositionUniteUrgence.propTypes = {
  formData: PropTypes.shape({
    disposition_unite_urgence_data: PropTypes.shape({
      sortie_su: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      autre_sortie_su: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      // Champs domicile
      consignes_domicile: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      accompagnant: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      rdv_controle: PropTypes.oneOfType([PropTypes.object, PropTypes.oneOf([null])]),
      // Champs hospitalisation
      diagnostique_hospitalisation: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      numero_chambre_lit: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      // Champs transfert
      hopital_transfert: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      autre_hopital: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      service_transfert: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      autre_service_transfert: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      motif_transfert: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
      // Champs décès
      cause_deces: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
    }).isRequired
  }).isRequired,
  handleChange: PropTypes.func.isRequired,
  handleDateChange: PropTypes.func.isRequired,
  AdapterDateFns: PropTypes.func.isRequired,
  setError: PropTypes.func
};
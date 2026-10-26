import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Autocomplete,
  Alert,
  IconButton,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  CleaningServices,
  Delete as DeleteIcon,
  Edit,
  Group as GroupIcon,
  MedicalInformation,
  Person as PersonIcon,
  ShoppingCart,
  Work as WorkIcon
} from '@mui/icons-material';

const typeMouvementOptions = {
  famille: [
    { value: 'vente', label: 'Vente', icon: <ShoppingCart /> },
    { value: 'don', label: 'Don/Aide sociale', icon: <GroupIcon /> }
  ],
  personnel: [
    { value: 'usage_medical', label: 'Usage médical', icon: <MedicalInformation /> },
    { value: 'formation', label: 'Formation', icon: <WorkIcon /> }
  ],
  service: [
    { value: 'maintenance', label: 'Maintenance/Nettoyage', icon: <CleaningServices /> },
    { value: 'administration', label: 'Administration', icon: <WorkIcon /> }
  ]
};

export const CommandeForm = ({ mode, initialData, articles, onSave, onClose }) => {
  const [formData, setFormData] = useState(initialData ? {
    type_beneficiaire: initialData.type_beneficiaire,
    beneficiaire: initialData.beneficiaire,
    contact: initialData.contact,
    type_mouvement: initialData.type_mouvement,
    articles: initialData.articles,
    commentaire: initialData.commentaire
  } : {
    type_beneficiaire: '',
    beneficiaire: '',
    contact: '',
    type_mouvement: '',
    articles: [],
    commentaire: ''
  });

  const addArticleToForm = () => {
    setFormData({
      ...formData,
      articles: [...formData.articles, { article: null, quantite: 1, prix_unitaire: 0 }]
    });
  };

  const updateArticleInForm = (index, field, value) => {
    const updatedArticles = [...formData.articles];
    if (field === 'article') {
      updatedArticles[index].article = value;
      updatedArticles[index].prix_unitaire = value?.prix_unitaire || 0;
    } else {
      updatedArticles[index][field] = value;
    }
    setFormData({ ...formData, articles: updatedArticles });
  };

  const removeArticleFromForm = (index) => {
    const updatedArticles = formData.articles.filter((_, i) => i !== index);
    setFormData({ ...formData, articles: updatedArticles });
  };

  const getTypeMouvementOptions = () => {
    return formData.type_beneficiaire ? typeMouvementOptions[formData.type_beneficiaire] || [] : [];
  };

  return (
    <>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Type de bénéficiaire</InputLabel>
                <Select
                  value={formData.type_beneficiaire}
                  label="Type de bénéficiaire"
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      type_beneficiaire: e.target.value,
                      type_mouvement: ''
                    });
                  }}
                >
                  <MenuItem value="famille">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <GroupIcon sx={{ mr: 1 }} />
                      Famille de patient
                    </Box>
                  </MenuItem>
                  <MenuItem value="personnel">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <PersonIcon sx={{ mr: 1 }} />
                      Personnel médical
                    </Box>
                  </MenuItem>
                  <MenuItem value="service">
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <WorkIcon sx={{ mr: 1 }} />
                      Service/Département
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth sx={{ mb: 2 }} disabled={!formData.type_beneficiaire}>
                <InputLabel>Type de mouvement</InputLabel>
                <Select
                  value={formData.type_mouvement}
                  label="Type de mouvement"
                  onChange={(e) => setFormData({ ...formData, type_mouvement: e.target.value })}
                >
                  {getTypeMouvementOptions().map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {option.icon}
                        <Typography sx={{ ml: 1 }}>{option.label}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                label="Nom du bénéficiaire"
                value={formData.beneficiaire}
                onChange={(e) => setFormData({ ...formData, beneficiaire: e.target.value })}
                placeholder={
                  formData.type_beneficiaire === 'famille' ? 'Ex: Marie Dubois (Famille Patient #1245)' :
                    formData.type_beneficiaire === 'personnel' ? 'Ex: Dr. Sophie Laurent - Service Cardiologie' :
                      formData.type_beneficiaire === 'service' ? 'Ex: Équipe de Nettoyage - Bâtiment A' :
                        'Nom du bénéficiaire'
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                fullWidth
                label="Contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder={
                  formData.type_beneficiaire === 'famille' ? 'Téléphone' :
                    formData.type_beneficiaire === 'personnel' ? 'Email' :
                      'Contact'
                }
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                label="Commentaire (optionnel)"
                value={formData.commentaire}
                onChange={(e) => setFormData({ ...formData, commentaire: e.target.value })}
                placeholder="Informations supplémentaires sur ce mouvement..."
              />
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Articles à distribuer</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addArticleToForm}
                variant="outlined"
                size="small"
                disabled={!formData.type_beneficiaire || !formData.type_mouvement}
              >
                Ajouter un article
              </Button>
            </Box>

            {formData.articles.map((item, index) => (
              <Card key={index} sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 4 }}>
                      <Autocomplete
                        fullWidth
                        options={articles}
                        getOptionLabel={(option) => option.nom}
                        value={item.article}
                        onChange={(event, newValue) => updateArticleInForm(index, 'article', newValue)}
                        renderInput={(params) => (
                          <TextField {...params} label="Article" />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body1">{option.nom}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                Stock: {option.quantite_stock} {option.unite} - Prix: {option.prix_unitaire.toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Quantité"
                        type="number"
                        value={item.quantite}
                        onChange={(e) => updateArticleInForm(index, 'quantite', parseInt(e.target.value) || 1)}
                        inputProps={{
                          min: 1,
                          max: item.article?.quantite_stock || 999
                        }}
                      />
                      {item.article && (
                        <Typography variant="caption" color="text.secondary">
                          Stock: {item.article.quantite_stock} {item.article.unite}
                        </Typography>
                      )}
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                      <TextField
                        fullWidth
                        label="Prix unitaire"
                        type="number"
                        value={item.prix_unitaire}
                        onChange={(e) => updateArticleInForm(index, 'prix_unitaire', parseFloat(e.target.value) || 0)}
                        inputProps={{ min: 0, step: 0.01 }}
                        InputProps={{
                          startAdornment: <Typography sx={{ mr: 1 }}>Ar</Typography>
                        }}
                      />
                    </Grid>
                    <Grid size={{ xs: 8, md: 3 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Sous-total
                        </Typography>
                        <Typography variant="h6" fontWeight="bold" color="primary">
                          {((item.quantite || 0) * (item.prix_unitaire || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                        </Typography>
                      </Box>
                      {item.article?.quantite_stock < item.quantite && (
                        <Alert severity="warning" sx={{ mt: 1 }}>
                          Stock insuffisant !
                        </Alert>
                      )}
                    </Grid>
                    <Grid size={{ xs: 4, md: 1 }}>
                      <IconButton
                        onClick={() => removeArticleFromForm(index)}
                        color="error"
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}

            {formData.articles.length === 0 && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {!formData.type_beneficiaire || !formData.type_mouvement ?
                  'Veuillez d\'abord sélectionner le type de bénéficiaire et le type de mouvement.' :
                  'Aucun article ajouté. Cliquez sur "Ajouter un article" pour commencer.'
                }
              </Alert>
            )}

            {formData.articles.length > 0 && (
              <Box sx={{ mt: 3, p: 3, bgcolor: 'primary.50', borderRadius: 2, border: '1px solid', borderColor: 'primary.200' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h6">
                      Total articles: {formData.articles.reduce((sum, item) => sum + (item.quantite || 0), 0)} unités
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Typography variant="h5" fontWeight="bold" color="primary" align="right">
                      Total: {formData.articles.reduce((sum, item) => sum + ((item.quantite || 0) * (item.prix_unitaire || 0)), 0).toLocaleString('fr-FR', { style: 'currency', currency: 'AMG' })}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} size="large">
          Annuler
        </Button>
        <Button
          onClick={() => onSave(formData)}
          variant="contained"
          size="large"
          disabled={
            !formData.type_beneficiaire ||
            !formData.type_mouvement ||
            !formData.beneficiaire ||
            formData.articles.length === 0 ||
            formData.articles.some(item => !item.article || item.quantite <= 0)
          }
          startIcon={mode === 'create' ? <AddIcon /> : <Edit />}
        >
          {mode === 'create' ? 'Enregistrer le mouvement' : 'Sauvegarder les modifications'}
        </Button>
      </DialogActions>
    </>
  );
};